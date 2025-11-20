<?php

namespace App\Notifications;

use App\Models\Setting;
use App\Models\Transaction;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PaymentPendingNotification extends Notification
{
    use Queueable;

    public function __construct(
        protected Transaction $transaction,
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

        $paymentUrl = $transaction->payment_url;
        $transactionUrl = route('user.transactions.show', ['transaction' => $transaction->id]);

        $ctaUrl = $paymentUrl ?: $transactionUrl;
        $ctaLabel = $paymentUrl ? 'Lanjutkan Pembayaran' : 'Lihat Detail Transaksi';

        return (new MailMessage)
            ->subject("Menunggu Pembayaran - {$appName}")
            ->view('emails.payment_pending', [
                'user' => $notifiable,
                'appName' => $appName,
                'invoice' => $invoice,
                'kelas' => $kelas,
                'totalFormatted' => $totalFormatted,
                'ctaUrl' => $ctaUrl,
                'ctaLabel' => $ctaLabel,
                'expiredAt' => $transaction->expired_at,
                'primaryColor' => '#2547F5',
            ]);
    }
}

