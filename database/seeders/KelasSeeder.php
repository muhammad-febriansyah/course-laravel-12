<?php

namespace Database\Seeders;

use App\Models\Benefit;
use App\Models\Category;
use App\Models\Kelas;
use App\Models\Level;
use App\Models\Quiz;
use App\Models\Section;
use App\Models\Type;
use App\Models\User;
use App\Models\Video;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;

class KelasSeeder extends Seeder
{
    public function run(): void
    {
        $this->ensureInstructors();

        $categories = Category::all();
        $types = Type::all();
        $levels = Level::all();
        $benefits = Benefit::all()->pluck('name');
        $instructors = User::where('email', 'like', 'instructor%')->get();

        if ($categories->isEmpty() || $types->isEmpty() || $levels->isEmpty() || $benefits->isEmpty()) {
            $this->command?->warn('Pastikan Category, Type, Level, dan Benefit sudah diseed sebelum menjalankan KelasSeeder.');
            return;
        }

        $target = 12;
        $existing = Kelas::count();
        $toCreate = max(0, $target - $existing);

        if ($toCreate === 0) {
            $this->command?->info('KelasSeeder: jumlah kursus sudah memenuhi target, skip penambahan.');
            return;
        }

        foreach (range(1, $toCreate) as $index) {
            $kelas = Kelas::factory()->create([
                'category_id' => $categories->random()->id,
                'type_id' => $types->random()->id,
                'level_id' => $levels->random()->id,
                'user_id' => $instructors->random()->id,
                'benefit' => $this->compileBenefits($benefits),
            ]);

            $sections = Section::factory()->count(rand(3, 5))->create([
                'kelas_id' => $kelas->id,
            ]);

            $sections->each(function (Section $section) {
                Video::factory()->count(rand(2, 4))->create([
                    'section_id' => $section->id,
                ]);
            });

            Quiz::factory()->count(rand(3, 5))->create([
                'kelas_id' => $kelas->id,
            ]);
        }
    }

    private function compileBenefits(Collection $benefits): string
    {
        if ($benefits->count() <= 3) {
            return $benefits->implode("\n");
        }

        $pick = rand(3, min(5, $benefits->count()));

        return $benefits->random($pick)->implode("\n");
    }

    private function ensureInstructors(): void
    {
        foreach (range(1, 3) as $index) {
            $email = sprintf('instructor%02d@demo.test', $index);

            User::firstOrCreate(
                ['email' => $email],
                [
                    'name' => 'Instructor ' . $index,
                    'password' => 'password',
                    'email_verified_at' => now(),
                    'role' => 'instructor',
                    'status' => 1,
                ]
            );
        }
    }
}
