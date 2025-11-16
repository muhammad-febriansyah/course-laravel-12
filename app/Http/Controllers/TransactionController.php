<?php

namespace App\Http\Controllers;

use App\Application\Enrollments\Services\EnrollmentService;
use App\Models\Transaction;
use App\Services\TripayService;
use App\Services\WhatsAppNotificationService;
use App\Notifications\PaymentPaidNotification;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransactionController extends Controller
{
    protected $tripayService;

    public function __construct(
        TripayService $tripayService,
        protected EnrollmentService $enrollmentService,
        protected WhatsAppNotificationService $whatsappNotificationService,
    ) {
        $this->tripayService = $tripayService;
    }

    // Admin: View all transactions
    public function index()
    {
        $transactions = Transaction::with(['user', 'kelas', 'promoCode'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('Admin/Transactions/Index', [
            'transactions' => $transactions
        ]);
    }

    // Admin: View transaction detail
    public function show(Transaction $transaction)
    {
        $transaction->load(['user', 'kelas', 'promoCode']);

        return Inertia::render('Admin/Transactions/Show', [
            'transaction' => $transaction
        ]);
    }

    // Admin: Approve transaction (untuk Cash payment)
    public function approve(Transaction $transaction)
    {
        if ($transaction->payment_method !== 'cash') {
            return back()->withErrors(['error' => 'Hanya transaksi Cash yang bisa di-approve manual!']);
        }

        if ($transaction->status !== 'pending') {
            return back()->withErrors(['error' => 'Transaksi sudah diproses!']);
        }

        $transaction->update([
            'status' => 'paid',
            'paid_at' => now(),
        ]);

        $this->autoEnrollIfEligible($transaction);
        $this->whatsappNotificationService->sendClassPurchaseNotification($transaction);

        // Notify user via email about successful payment
        $transaction->loadMissing(['user', 'kelas']);
        if ($transaction->user) {
            $transaction->user->notify(new PaymentPaidNotification($transaction));
        }

        return back()->with('success', 'Transaksi berhasil di-approve!');
    }

    // Admin: Reject transaction (untuk Cash payment)
    public function reject(Transaction $transaction, Request $request)
    {
        if ($transaction->payment_method !== 'cash') {
            return back()->withErrors(['error' => 'Hanya transaksi Cash yang bisa di-reject manual!']);
        }

        if ($transaction->status !== 'pending') {
            return back()->withErrors(['error' => 'Transaksi sudah diproses!']);
        }

        $transaction->update([
            'status' => 'failed',
            'notes' => $request->notes ?? 'Ditolak oleh admin',
        ]);

        return back()->with('success', 'Transaksi berhasil di-reject!');
    }

    // Webhook Callback dari Tripay
    public function callback(Request $request)
    {
        $callbackSignature = $request->server('HTTP_X_CALLBACK_SIGNATURE');
        $json = $request->getContent();

        if (!$this->tripayService->validateCallbackSignature($callbackSignature, $json)) {
            return response()->json(['success' => false, 'message' => 'Invalid signature'], 400);
        }

        $data = json_decode($json, true);

        $transaction = Transaction::where('tripay_reference', $data['reference'])->first();

        if (!$transaction) {
            return response()->json(['success' => false, 'message' => 'Transaction not found'], 404);
        }

        $wasPaid = $transaction->isPaid();

        $updatePayload = [
            'metadata' => $data,
        ];

        if ($data['status'] === 'PAID' && !$wasPaid) {
            $updatePayload['status'] = 'paid';
            $updatePayload['paid_at'] = now();
        } elseif ($data['status'] === 'EXPIRED') {
            $updatePayload['status'] = 'expired';
        } elseif ($data['status'] === 'FAILED') {
            $updatePayload['status'] = 'failed';
        }

        $transaction->update($updatePayload);

        if ($data['status'] === 'PAID' && !$wasPaid) {
            $this->autoEnrollIfEligible($transaction);
            $this->whatsappNotificationService->sendClassPurchaseNotification($transaction);

             // Notify user via email about successful payment
             $transaction->loadMissing(['user', 'kelas']);
             if ($transaction->user) {
                 $transaction->user->notify(new PaymentPaidNotification($transaction));
             }
        }

        return response()->json(['success' => true]);
    }

    private function autoEnrollIfEligible(Transaction $transaction): void
    {
        if (!$transaction->user_id || !$transaction->kelas_id) {
            return;
        }

        $this->enrollmentService->enroll(
            userId: $transaction->user_id,
            kelasId: $transaction->kelas_id,
            status: 'active',
        );
    }
}
