<?php

namespace App\Notifications;

use App\Models\Setting;
use App\Models\Transaction;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PaymentFailedNotification extends Notification
{
    use Queueable;

    public function __construct(
        protected Transaction $transaction,
        protected ?string $reason = null,
    ) {
    }

    protected function getSiteName(): string
    {
        $siteName = Setting::query()->value('site_name');

        return $siteName ?: config('app.name', 'Skill UP');
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $transaction = $this->transaction->loadMissing(['kelas']);
        $kelas = $transaction->kelas;

        $appName = $this->getSiteName();

        $invoice = $transaction->invoice_number
            ?? $transaction->tripay_merchant_ref
            ?? ($transaction->id ? 'TRX-' . $transaction->id : 'Transaksi');

        $amount = (float) ($transaction->total ?? $transaction->amount ?? 0);
        $totalFormatted = number_format($amount, 0, ',', '.');

        $status = strtolower((string) $transaction->status);
        $statusLabel = match ($status) {
            'expired' => 'Kadaluarsa',
            'failed' => 'Gagal',
            default => ucfirst($status ?: 'Tidak Berhasil'),
        };

        $defaultReason = $status === 'expired'
            ? 'Pembayaran melewati batas waktu yang ditentukan.'
            : 'Pembayaran tidak berhasil diproses.';

        $reason = $this->reason ?: $defaultReason;

        $ctaUrl = $kelas && $kelas->slug
            ? route('courses.show', $kelas->slug)
            : route('user.purchases');

        $ctaLabel = $kelas ? 'Coba Checkout Ulang' : 'Lihat Kelas Lainnya';

        return (new MailMessage)
            ->subject("Pembayaran {$statusLabel} - {$appName}")
            ->view('emails.payment_failed', [
                'user' => $notifiable,
                'appName' => $appName,
                'invoice' => $invoice,
                'kelas' => $kelas,
                'totalFormatted' => $totalFormatted,
                'statusLabel' => $statusLabel,
                'reason' => $reason,
                'ctaUrl' => $ctaUrl,
                'ctaLabel' => $ctaLabel,
                'primaryColor' => '#DC2626',
            ]);
    }
}

