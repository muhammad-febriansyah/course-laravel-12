<?php

namespace Database\Seeders;

use App\Models\Benefit;
use Illuminate\Database\Seeder;

class BenefitSeeder extends Seeder
{
    public function run(): void
    {
        $benefits = [
            'Akses materi seumur hidup',
            'Grup diskusi eksklusif',
            'Mentoring langsung dari instruktur',
            'Sertifikat kelulusan',
            'Materi dapat diunduh',
        ];

        foreach ($benefits as $benefit) {
            Benefit::firstOrCreate(['name' => $benefit]);
        }
    }
}
