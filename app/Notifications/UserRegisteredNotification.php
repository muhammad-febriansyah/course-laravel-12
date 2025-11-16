<?php

namespace App\Notifications;

use App\Models\Setting;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class UserRegisteredNotification extends Notification
{
    use Queueable;

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
        $appName = $this->getSiteName();

        return (new MailMessage)
            ->subject("Selamat datang di {$appName}")
            ->view('emails.user_registered', [
                'user' => $notifiable,
                'appName' => $appName,
                'dashboardUrl' => route('dashboard'),
                'primaryColor' => '#2547F5',
            ]);
    }
}
