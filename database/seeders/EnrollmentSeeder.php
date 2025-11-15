<?php

namespace Database\Seeders;

use App\Domain\Enrollment\EnrollmentStatus;
use App\Models\Enrollment;
use App\Models\Kelas;
use App\Models\User;
use Illuminate\Database\Seeder;

class EnrollmentSeeder extends Seeder
{
    public function run(): void
    {
        $student = User::where('email', 'test@example.com')->first();

        if (!$student) {
            $this->command?->warn('User test@example.com tidak ditemukan, skip EnrollmentSeeder.');
            return;
        }

        $kelasList = Kelas::inRandomOrder()->take(5)->get();

        if ($kelasList->isEmpty()) {
            $this->command?->warn('Belum ada Kelas, jalankan KelasSeeder terlebih dahulu.');
            return;
        }

        foreach ($kelasList as $index => $kelas) {
            $status = match (true) {
                $index === 0 => EnrollmentStatus::COMPLETED,
                $index === 1 => EnrollmentStatus::EXPIRED,
                default => EnrollmentStatus::ACTIVE,
            };

            Enrollment::updateOrCreate(
                [
                    'user_id' => $student->id,
                    'kelas_id' => $kelas->id,
                ],
                [
                    'status' => $status->value,
                    'enrolled_at' => now()->subDays(rand(5, 30)),
                    'completed_at' => $status === EnrollmentStatus::COMPLETED ? now()->subDays(rand(1, 5)) : null,
                    'expires_at' => $status === EnrollmentStatus::EXPIRED ? now()->subDays(rand(1, 3)) : null,
                    'progress_percentage' => $status === EnrollmentStatus::COMPLETED
                        ? 100
                        : ($status === EnrollmentStatus::EXPIRED ? rand(10, 60) : rand(40, 95)),
                    'videos_completed' => rand(0, 15),
                    'quizzes_completed' => rand(0, 5),
                    'last_accessed_at' => now()->subDays(rand(0, 3)),
                ]
            );
        }
    }
}
