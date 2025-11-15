<?php

namespace Database\Factories;

use App\Domain\Enrollment\EnrollmentStatus;
use App\Models\Enrollment;
use App\Models\Kelas;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Enrollment>
 */
class EnrollmentFactory extends Factory
{
    protected $model = Enrollment::class;

    public function definition(): array
    {
        $status = $this->faker->randomElement(EnrollmentStatus::cases());
        $enrolledAt = $this->faker->dateTimeBetween('-60 days', '-1 day');

        return [
            'user_id' => User::factory(),
            'kelas_id' => Kelas::factory(),
            'status' => $status->value,
            'enrolled_at' => $enrolledAt,
            'completed_at' => $status === EnrollmentStatus::COMPLETED
                ? $this->faker->dateTimeBetween($enrolledAt, 'now')
                : null,
            'expires_at' => $status === EnrollmentStatus::EXPIRED
                ? $this->faker->dateTimeBetween('-30 days', 'now')
                : null,
        ];
    }

    public function active(): self
    {
        return $this->state(fn () => [
            'status' => EnrollmentStatus::ACTIVE->value,
            'completed_at' => null,
            'expires_at' => null,
        ]);
    }

    public function forUser(User $user): self
    {
        return $this->state(fn () => ['user_id' => $user->id]);
    }

    public function forKelas(Kelas $kelas): self
    {
        return $this->state(fn () => ['kelas_id' => $kelas->id]);
    }
}
