<?php

namespace Database\Factories;

use App\Models\Kelas;
use App\Models\PromoCode;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Transaction>
 */
class TransactionFactory extends Factory
{
    protected $model = Transaction::class;

    public function definition(): array
    {
        $paymentMethod = $this->faker->randomElement(['tripay', 'cash']);
        $status = $this->faker->randomElement(['pending', 'paid', 'expired']);
        $amount = $this->faker->numberBetween(150000, 750000);
        $discount = $this->faker->boolean(30) ? $this->faker->numberBetween(10000, 75000) : 0;
        $total = max($amount - $discount, 0);

        return [
            'invoice_number' => 'INV/' . now()->format('Ymd') . '/' . $this->faker->unique()->numerify('####'),
            'user_id' => User::factory(),
            'kelas_id' => Kelas::factory(),
            'promo_code_id' => null,
            'payment_method' => $paymentMethod,
            'payment_channel' => $paymentMethod === 'tripay' ? $this->faker->randomElement(['QRIS', 'BCA VA', 'Mandiri VA']) : null,
            'amount' => $amount,
            'discount' => $discount,
            'total' => $total,
            'admin_fee' => $paymentMethod === 'tripay' ? 4000 : 0,
            'tripay_reference' => $paymentMethod === 'tripay' ? Str::upper($this->faker->bothify('TRX########')) : null,
            'status' => $status,
            'paid_at' => $status === 'paid' ? $this->faker->dateTimeBetween('-30 days', 'now') : null,
            'expired_at' => $status === 'expired' ? $this->faker->dateTimeBetween('-30 days', 'now') : null,
            'metadata' => [],
        ];
    }

    public function forUser(User $user): self
    {
        return $this->state(fn () => ['user_id' => $user->id]);
    }

    public function forKelas(Kelas $kelas): self
    {
        return $this->state(fn () => ['kelas_id' => $kelas->id]);
    }

    public function withPromo(PromoCode $promo): self
    {
        return $this->state(fn () => ['promo_code_id' => $promo->id]);
    }

    public function paid(): self
    {
        return $this->state(fn () => [
            'status' => 'paid',
            'paid_at' => now()->subDays(rand(1, 10)),
        ]);
    }
}
