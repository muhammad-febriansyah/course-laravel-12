<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class NewsCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Teknologi Pembelajaran',
                'slug' => 'teknologi-pembelajaran',
                'image' => 'news-categories/teknologi-pembelajaran.jpg',
            ],
            [
                'name' => 'Tips & Trik Belajar',
                'slug' => 'tips-trik-belajar',
                'image' => 'news-categories/tips-trik-belajar.jpg',
            ],
            [
                'name' => 'Karir & Pengembangan',
                'slug' => 'karir-pengembangan',
                'image' => 'news-categories/karir-pengembangan.jpg',
            ],
            [
                'name' => 'Berita Pendidikan',
                'slug' => 'berita-pendidikan',
                'image' => 'news-categories/berita-pendidikan.jpg',
            ],
            [
                'name' => 'Inspirasi & Motivasi',
                'slug' => 'inspirasi-motivasi',
                'image' => 'news-categories/inspirasi-motivasi.jpg',
            ],
        ];

        foreach ($categories as $category) {
            \App\Models\NewsCategory::firstOrCreate(
                ['slug' => $category['slug']],
                $category
            );
        }
    }
}
