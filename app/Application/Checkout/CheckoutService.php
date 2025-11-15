<?php

namespace App\Application\Checkout;

use App\Application\Enrollments\Services\EnrollmentService;
use App\Models\Enrollment;
use App\Models\Kelas;
use App\Models\PromoCode;
use App\Models\Setting;
use App\Models\Transaction;
use App\Models\User;
use App\Services\TripayService;
use Carbon\Carbon;
use Illuminate\Validation\ValidationException;

class CheckoutService
{
    public function __construct(
        private readonly EnrollmentService $enrollmentService,
        private readonly TripayService $tripayService,
    ) {
    }

    /**
     * @param array{payment_method?: string, promo_code?: string|null, payment_channel?: string|null} $data
     */
    public function initiate(User $user, Kelas $kelas, array $data): Transaction
    {
        if (Enrollment::where('user_id', $user->id)->where('kelas_id', $kelas->id)->exists()) {
            throw ValidationException::withMessages([
                'kelas' => 'Kamu sudah terdaftar di kursus ini.',
            ]);
        }

        $paymentMethod = $data['payment_method'] ?? 'cash';
        $paymentChannel = $data['payment_channel'] ?? null;
        $promo = null;

        if ($paymentMethod === 'tripay' && empty($paymentChannel)) {
            throw ValidationException::withMessages([
                'payment_channel' => 'Silakan pilih kanal pembayaran Tripay.',
            ]);
        }

        if (!empty($data['promo_code'])) {
            $promo = PromoCode::where('code', strtoupper($data['promo_code']))
                ->where('status', true)
                ->first();

            if (!$promo) {
                throw ValidationException::withMessages([
                    'promo_code' => 'Kode promo tidak ditemukan atau tidak aktif.',
                ]);
            }
        }

        $amount = (float) $kelas->price;
        $discount = min($promo?->discount ?? 0, $amount);
        $baseTotal = max($amount - $discount, 0);

        $adminFeeRate = $this->resolveAdminFeePercentage();
        $shouldApplyAdminFee = $paymentMethod === 'tripay';
        $adminFee = $shouldApplyAdminFee ? round($baseTotal * $adminFeeRate) : 0.0;
        $grandTotal = $baseTotal + $adminFee;

        $invoiceNumber = Transaction::generateInvoiceNumber();

        $transaction = Transaction::create([
            'invoice_number' => $invoiceNumber,
            'user_id' => $user->id,
            'kelas_id' => $kelas->id,
            'promo_code_id' => $promo?->id,
            'payment_method' => $paymentMethod,
            'payment_channel' => $paymentMethod === 'tripay' ? $paymentChannel : null,
            'amount' => $amount,
            'discount' => $discount,
            'total' => $grandTotal,
            'admin_fee' => $adminFee,
            'status' => 'pending',
            'metadata' => [
                'source' => 'inertia_checkout',
            ],
        ]);

        if ($paymentMethod === 'cash') {
            // For MVP, mark cash payments as paid immediately
            $transaction->markAsPaid();
            $this->enrollmentService->enroll($user->id, $kelas->id);
            $transaction->refresh();
        } elseif ($paymentMethod === 'tripay') {
            $tripayResponse = $this->tripayService->createTransaction([
                'method' => $paymentChannel,
                'merchant_ref' => $invoiceNumber,
                'amount' => $grandTotal,
                'customer_name' => $user->name,
                'customer_email' => $user->email,
                'customer_phone' => $user->phone ?? '',
                'order_items' => [
                    [
                        'sku' => $kelas->slug,
                        'name' => $kelas->title,
                        'price' => $grandTotal,
                        'quantity' => 1,
                        'product_url' => route('courses.show', $kelas->slug),
                    ],
                ],
                'return_url' => route('user.transactions.show', ['transaction' => $transaction->id]),
            ]);

            if (!($tripayResponse['success'] ?? false)) {
                $transaction->delete();

                throw ValidationException::withMessages([
                    'payment_method' => $tripayResponse['message'] ?? 'Gagal membuat transaksi Tripay. Silakan coba lagi.',
                ]);
            }

            $tripayData = $tripayResponse['data'] ?? [];
            $expiresAt = isset($tripayData['expired_time'])
                ? Carbon::createFromTimestamp($tripayData['expired_time'])
                : null;

            $transaction->update([
                'payment_channel' => $tripayData['payment_method'] ?? $paymentChannel,
                'tripay_reference' => $tripayData['reference'] ?? null,
                'tripay_merchant_ref' => $tripayData['merchant_ref'] ?? $invoiceNumber,
                'payment_url' => $tripayData['checkout_url'] ?? null,
                'payment_instructions' => $tripayData['instructions'] ?? null,
                'expired_at' => $expiresAt,
                'total' => (float) ($tripayData['amount'] ?? $grandTotal),
                'metadata' => array_merge($transaction->metadata ?? [], [
                    'tripay' => $tripayData,
                ]),
            ]);

            $transaction->refresh();
        }

        return $transaction;
    }

    private function resolveAdminFeePercentage(): float
    {
        $fee = Setting::query()->value('fee');

        if ($fee === null) {
            return 0.0;
        }

        if (is_numeric($fee)) {
            $numericFee = (float) $fee;
        } else {
            $normalized = preg_replace('/[^0-9,\.]/', '', (string) $fee);
            if ($normalized === null) {
                return 0.0;
            }

            $normalized = str_replace('.', '', $normalized);
            $normalized = str_replace(',', '.', $normalized);

            $numericFee = (float) $normalized;
        }

        if (!is_finite($numericFee)) {
            return 0.0;
        }

        $clamped = max(0.0, min($numericFee, 100.0));

        return $clamped / 100;
    }
}
