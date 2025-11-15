<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class HeroSectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $setting = Setting::first();

        if ($setting) {
            $setting->update([
                'hero_title' => 'Raih Skill Masa Depan',
                'hero_subtitle' => 'Platform pembelajaran online terbaik di Indonesia. Kami menyediakan berbagai kursus berkualitas dengan instruktur berpengalaman untuk membantu Anda mengembangkan skill dan karir.',
                'hero_stat1_number' => '10K+',
                'hero_stat1_label' => 'Siswa Aktif',
                'hero_stat2_number' => '100+',
                'hero_stat2_label' => 'Kursus Premium',
                'hero_stat3_number' => '50+',
                'hero_stat3_label' => 'Mentor Expert',
                'hero_badge_title' => 'Kursus Terpopuler',
                'hero_badge_subtitle' => 'Web Development Bootcamp',
                'hero_active_label' => 'Active Now',
                'hero_active_value' => '2.5K+ Students',
            ]);

            $this->command->info('Hero section data berhasil ditambahkan!');
        } else {
            $this->command->error('Setting tidak ditemukan. Pastikan tabel settings memiliki data.');
        }
    }
}
