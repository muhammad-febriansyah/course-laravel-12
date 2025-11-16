<?php

namespace App\Services;

use App\Models\Setting;
use App\Models\Transaction;
use Illuminate\Support\Facades\Log;

class WhatsAppNotificationService
{
    protected ?string $siteName = null;

    protected function isEnabled(): bool
    {
        // Central flag to enable/disable WhatsApp gateway
        return (bool) env('APP_WA_ENABLED', false);
    }

    public function sendClassPurchaseNotification(Transaction $transaction): void
    {
        if (! $this->isEnabled()) {
            Log::info('WhatsApp purchase notification skipped: gateway disabled');
            return;
        }
        $transaction->loadMissing(['user', 'kelas']);

        $user = $transaction->user;
        $kelas = $transaction->kelas;

        if ($user === null) {
            Log::warning('WhatsApp purchase notification skipped: transaction has no user relation', [
                'transaction_id' => $transaction->id,
            ]);
            return;
        }

        if ($kelas === null) {
            Log::warning('WhatsApp purchase notification skipped: transaction has no kelas relation', [
                'transaction_id' => $transaction->id,
            ]);
            return;
        }

        $phone = $user->phone;

        if (empty($phone)) {
            Log::warning('WhatsApp purchase notification skipped: user has no phone number', [
                'transaction_id' => $transaction->id,
                'user_id' => $user->id,
            ]);
            return;
        }

        $message = $this->buildPurchaseMessage($transaction);
        $this->sendWhatsAppMessage($phone, $message);
    }

    protected function buildPurchaseMessage(Transaction $transaction): string
    {
        $transaction->loadMissing(['user', 'kelas']);

        $user = $transaction->user;
        $kelas = $transaction->kelas;

        $appName = $this->getSiteName();
        $invoice = $transaction->invoice_number
            ?? $transaction->tripay_merchant_ref
            ?? ($transaction->id ? 'TRX-' . $transaction->id : 'Transaksi');
        $total = number_format((float) ($transaction->total ?? $transaction->amount ?? 0), 0, ',', '.');
        $paidAt = optional($transaction->paid_at)->format('d/m/Y H:i');
        $method = $this->formatPaymentMethod($transaction->payment_method, $transaction->payment_channel);
        $courseUrl = $kelas && $kelas->slug
            ? route('courses.show', $kelas->slug)
            : url('/courses');

        $lines = [
            "*{$appName} - Konfirmasi Pembelian*",
            '',
            "Halo {$user?->name},",
            "Pembayaran kamu untuk kelas *{$kelas?->title}* sudah kami terima.",
            '',
            '*Detail Transaksi*',
            "- Invoice : {$invoice}",
            "- Metode  : {$method}",
            "- Total   : Rp {$total}",
        ];

        if ($paidAt) {
            $lines[] = "- Tanggal : {$paidAt}";
        }

        $lines[] = '';
        $lines[] = 'Kamu bisa mulai belajar melalui tautan berikut:';
        $lines[] = $courseUrl;
        $lines[] = '';
        $lines[] = 'Selamat belajar dan semoga sukses!';
        $lines[] = "Tim {$appName}";

        return implode("\n", $lines);
    }

    protected function formatPaymentMethod(?string $method, ?string $channel): string
    {
        $parts = array_filter([
            $method ? ucwords(str_replace('_', ' ', $method)) : null,
            $channel ? strtoupper($channel) : null,
        ]);

        return implode(' - ', $parts) ?: 'Pembayaran Online';
    }

    protected function sendWhatsAppMessage(string $number, string $message): void
    {
        $waNumber = preg_replace('/[^0-9]/', '', $number);

        if (empty($waNumber) || strlen($waNumber) < 9) {
            Log::warning('WhatsApp message not sent: invalid phone number', [
                'raw_number' => $number,
                'normalized' => $waNumber,
            ]);
            return;
        }

        $waGatewayUrl = env('APP_WA_URL');

        if (empty($waGatewayUrl)) {
            Log::warning('WhatsApp message not sent: APP_WA_URL missing in environment');
            return;
        }

        try {
            Log::info("Sending WhatsApp message to {$waNumber}", [
                'message_preview' => mb_substr($message, 0, 120),
            ]);

            $curl = curl_init();
            curl_setopt_array($curl, [
                CURLOPT_URL => $waGatewayUrl,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 30,
                CURLOPT_CONNECTTIMEOUT => 30,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'POST',
                CURLOPT_POSTFIELDS => http_build_query([
                    'message' => $message,
                    'to' => $waNumber,
                ]),
                CURLOPT_DNS_CACHE_TIMEOUT => 120,
                CURLOPT_IPRESOLVE => CURL_IPRESOLVE_V4,
                CURLOPT_SSL_VERIFYPEER => false,
                CURLOPT_SSL_VERIFYHOST => 0,
                CURLOPT_USERAGENT => $this->getSiteName() . '-WhatsApp-Service/1.0',
                CURLOPT_HTTPHEADER => [
                    'Content-Type: application/x-www-form-urlencoded',
                    'Accept: application/json',
                ],
            ]);

            $response = curl_exec($curl);
            $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
            $err = curl_error($curl);
            curl_close($curl);

            if ($err) {
                Log::error('WhatsApp message failed: cURL error', [
                    'number' => $waNumber,
                    'error' => $err,
                ]);
                return;
            }

            if ($httpCode >= 400) {
                Log::error('WhatsApp message failed: HTTP error', [
                    'number' => $waNumber,
                    'status' => $httpCode,
                    'response' => $response,
                ]);
                return;
            }

            Log::info('WhatsApp message sent successfully', [
                'number' => $waNumber,
                'status' => $httpCode,
                'response' => $response,
            ]);
        } catch (\Throwable $e) {
            Log::error('WhatsApp message failed: exception thrown', [
                'number' => $waNumber,
                'exception' => $e->getMessage(),
            ]);
        }
    }

    protected function getSiteName(): string
    {
        if ($this->siteName !== null) {
            return $this->siteName;
        }

        $siteName = Setting::query()->value('site_name');

        if (! empty($siteName)) {
            return $this->siteName = $siteName;
        }

        return $this->siteName = config('app.name', 'Course Platform');
    }
}
