<?php

namespace Database\Seeders;

use App\Models\Enrollment;
use App\Models\Kelas;
use App\Models\PromoCode;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Seeder;

class TransactionSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::where('email', 'test@example.com')->first();
        $kelasList = Kelas::inRandomOrder()->take(3)->get();
        $promo = PromoCode::first();

        if (!$user || $kelasList->isEmpty()) {
            $this->command?->warn('User atau Kelas tidak ditemukan. Skip seeding transactions.');
            return;
        }

        $transactions = [
            [
                'status' => 'paid',
                'payment_method' => 'tripay',
                'payment_channel' => 'QRIS',
                'discount' => 0,
                'admin_fee' => 2500,
            ],
            [
                'status' => 'pending',
                'payment_method' => 'cash',
                'payment_channel' => null,
                'discount' => 50000,
                'admin_fee' => 0,
            ],
            [
                'status' => 'expired',
                'payment_method' => 'tripay',
                'payment_channel' => 'BCA Virtual Account',
                'discount' => 0,
                'admin_fee' => 4000,
            ],
        ];

        foreach ($transactions as $index => $payload) {
            $kelas = $kelasList[$index];
            $amount = $kelas->price;
            $discount = $payload['discount'];
            $total = max($amount - $discount, 0);

            $transaction = Transaction::updateOrCreate(
                [
                    'invoice_number' => sprintf('INV/%s/%04d', now()->format('Ymd'), $index + 1),
                ],
                [
                    'user_id' => $user->id,
                    'kelas_id' => $kelas->id,
                    'promo_code_id' => $promo?->id,
                    'payment_method' => $payload['payment_method'],
                    'payment_channel' => $payload['payment_channel'],
                    'amount' => $amount,
                    'discount' => $discount,
                    'total' => $total,
                    'admin_fee' => $payload['admin_fee'],
                    'status' => $payload['status'],
                    'paid_at' => $payload['status'] === 'paid' ? now()->subDays(2 + $index) : null,
                    'expired_at' => $payload['status'] === 'expired' ? now()->subDay() : null,
                    'tripay_reference' => $payload['payment_method'] === 'tripay'
                        ? 'T' . (time() - ($index * 1000))
                        : null,
                    'payment_url' => $payload['payment_method'] === 'tripay'
                        ? 'https://tripay.co.id/checkout/T' . (time() - ($index * 1000))
                        : null,
                ]
            );

            if ($transaction->status === 'paid') {
                Enrollment::updateOrCreate(
                    [
                        'user_id' => $user->id,
                        'kelas_id' => $kelas->id,
                    ],
                    [
                        'status' => 'active',
                        'enrolled_at' => $transaction->paid_at ?? now(),
                    ]
                );
            }
        }

        $this->command?->info('3 dummy transactions created successfully!');
    }
}
