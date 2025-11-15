<?php

namespace Database\Seeders;

use App\Models\VisiMisi;
use Illuminate\Database\Seeder;

class VisiMisiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        VisiMisi::firstOrCreate(
            [],
            [
                'visi' => '<p>Menjadi platform pembelajaran daring terdepan yang membantu siapa pun berkembang melalui mentoring profesional dan kurikulum yang relevan.</p>',
                'misi' => '<ul><li>Menyediakan materi dan program pembelajaran yang selalu diperbarui sesuai kebutuhan industri.</li><li>Menghubungkan peserta dengan mentor berpengalaman yang siap berbagi praktik terbaik.</li><li>Membangun komunitas belajar yang saling mendukung untuk mencapai tujuan karier.</li></ul>',
            ]
        );
    }
}
