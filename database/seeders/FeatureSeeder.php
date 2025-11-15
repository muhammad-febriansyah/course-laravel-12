<?php

namespace Database\Seeders;

use App\Models\Feature;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FeatureSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $features = [
            [
                'title' => 'Instruktur Berpengalaman',
                'description' => 'Belajar langsung dari para ahli di bidangnya dengan pengalaman industri bertahun-tahun',
                'icon' => 'GraduationCap',
                'order' => 1,
                'is_active' => true,
            ],
            [
                'title' => 'Belajar Fleksibel',
                'description' => 'Akses kursus kapan saja, di mana saja sesuai dengan jadwal Anda sendiri',
                'icon' => 'Clock',
                'order' => 2,
                'is_active' => true,
            ],
            [
                'title' => 'Sertifikat Resmi',
                'description' => 'Dapatkan sertifikat yang diakui industri setelah menyelesaikan kursus',
                'icon' => 'Award',
                'order' => 3,
                'is_active' => true,
            ],
            [
                'title' => 'Materi Terupdate',
                'description' => 'Konten pembelajaran selalu diperbarui mengikuti perkembangan teknologi terkini',
                'icon' => 'Sparkles',
                'order' => 4,
                'is_active' => true,
            ],
            [
                'title' => 'Komunitas Aktif',
                'description' => 'Bergabung dengan komunitas siswa dan mentor untuk saling berbagi pengalaman',
                'icon' => 'Users',
                'order' => 5,
                'is_active' => true,
            ],
            [
                'title' => 'Harga Terjangkau',
                'description' => 'Investasi pendidikan dengan harga yang kompetitif dan value yang maksimal',
                'icon' => 'Wallet',
                'order' => 6,
                'is_active' => true,
            ],
        ];

        foreach ($features as $feature) {
            Feature::create($feature);
        }

        $this->command->info('Features seeded successfully!');
    }
}
