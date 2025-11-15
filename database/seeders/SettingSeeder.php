<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Setting;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Setting::create([
            'site_name' => 'Course LMS',
            'keyword' => 'kursus online, belajar online, pelatihan, e-learning',
            'email' => 'info@courselms.com',
            'address' => 'Jl. Pendidikan No. 123, Jakarta Selatan, DKI Jakarta 12345',
            'phone' => '+62 21 1234 5678',
            'desc' => 'Platform pembelajaran online terbaik di Indonesia. Kami menyediakan berbagai kursus berkualitas dengan instruktur berpengalaman untuk membantu Anda mengembangkan skill dan karir.',
            'yt' => 'https://youtube.com/@courselms',
            'ig' => 'https://instagram.com/courselms',
            'tiktok' => 'https://tiktok.com/@courselms',
            'fb' => 'https://facebook.com/courselms',
            'logo' => '/images/logo.png',
            'favicon' => '/images/favicon.ico',
            'thumbnail' => '/images/thumbnail.jpg',
            'fee' => '5',
        ]);
    }
}
