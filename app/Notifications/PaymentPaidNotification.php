<?php

namespace App\Notifications;

use App\Models\Transaction;
use App\Models\Setting;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PaymentPaidNotification extends Notification
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

        $courseUrl = $kelas && $kelas->slug
            ? route('user.learn.course', $kelas->slug)
            : route('user.purchases');

        $bodyUrl = $kelas ? $courseUrl : route('user.purchases');
        $bodyCtaLabel = $kelas ? 'Mulai Belajar' : 'Lihat Pembelian';

        return (new MailMessage)
            ->subject("Pembayaran Berhasil - {$appName}")
            ->view('emails.payment_paid', [
                'user' => $notifiable,
                'appName' => $appName,
                'invoice' => $invoice,
                'kelas' => $kelas,
                'totalFormatted' => $totalFormatted,
                'ctaUrl' => $bodyUrl,
                'ctaLabel' => $bodyCtaLabel,
                'primaryColor' => '#2547F5',
            ]);
    }
}
