<?php

namespace Database\Seeders;

use App\Models\Discussion;
use App\Models\Kelas;
use App\Models\User;
use Illuminate\Database\Seeder;

class DiscussionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get mentor with ID 3 (Mentor Digital)
        $mentor = User::find(3);

        if (!$mentor) {
            $this->command->error('Mentor dengan ID 3 tidak ditemukan!');
            return;
        }

        // Get all kelas from this mentor
        $kelasList = Kelas::where('user_id', $mentor->id)->get();

        if ($kelasList->isEmpty()) {
            $this->command->error('Tidak ada kelas dari mentor ini!');
            return;
        }

        // Get student users (role = 'user')
        $students = User::where('role', 'user')->get();

        if ($students->isEmpty()) {
            $this->command->error('Tidak ada user student!');
            return;
        }

        $discussions = [
            [
                'title' => 'Bagaimana cara menginstall Node.js?',
                'content' => 'Halo mentor, saya masih bingung bagaimana cara menginstall Node.js di Windows. Apakah ada tutorial yang bisa saya ikuti? Terima kasih.',
                'is_resolved' => false,
            ],
            [
                'title' => 'Error saat menjalankan npm install',
                'content' => 'Saya mendapatkan error "npm ERR! code ENOENT" saat menjalankan npm install. Apa yang harus saya lakukan?',
                'is_resolved' => true,
            ],
            [
                'title' => 'Perbedaan antara var, let, dan const?',
                'content' => 'Bisa tolong jelaskan perbedaan antara var, let, dan const di JavaScript? Kapan sebaiknya menggunakan masing-masing?',
                'is_resolved' => true,
            ],
            [
                'title' => 'Cara menggunakan React Hooks',
                'content' => 'Saya baru belajar React dan masih bingung dengan konsep Hooks seperti useState dan useEffect. Bisa dijelaskan dengan contoh sederhana?',
                'is_resolved' => false,
            ],
            [
                'title' => 'Setup Android Studio untuk pemula',
                'content' => 'Saya kesulitan setup Android Studio pertama kali. Spesifikasi laptop saya RAM 8GB, apakah cukup?',
                'is_resolved' => false,
            ],
            [
                'title' => 'Cara deploy aplikasi React ke Vercel',
                'content' => 'Aplikasi React saya sudah jadi, bagaimana cara deploy ke Vercel? Apakah ada step-by-step guide?',
                'is_resolved' => true,
            ],
            [
                'title' => 'Bug pada fitur login',
                'content' => 'Saat saya mencoba login, muncul error 401. Padahal username dan password sudah benar. Mohon bantuannya.',
                'is_resolved' => false,
            ],
            [
                'title' => 'Rekomendasi library untuk form validation',
                'content' => 'Mentor, library apa yang recommended untuk handle form validation di React? Saya lihat banyak pilihan seperti Formik, React Hook Form, dll.',
                'is_resolved' => true,
            ],
            [
                'title' => 'Cara optimize performance React app',
                'content' => 'Aplikasi React saya terasa lambat saat data banyak. Ada tips untuk optimize performance?',
                'is_resolved' => false,
            ],
            [
                'title' => 'Tutorial membuat REST API dengan Node.js',
                'content' => 'Apakah di kelas ini akan dibahas cara membuat REST API dengan Node.js dan Express? Atau ada resource tambahan yang bisa saya pelajari?',
                'is_resolved' => true,
            ],
        ];

        foreach ($discussions as $index => $discussionData) {
            // Rotate through kelas and students
            $kelas = $kelasList[$index % $kelasList->count()];
            $student = $students[$index % $students->count()];

            $discussion = Discussion::create([
                'kelas_id' => $kelas->id,
                'user_id' => $student->id,
                'title' => $discussionData['title'],
                'content' => $discussionData['content'],
                'is_resolved' => $discussionData['is_resolved'],
                'parent_id' => null, // Main question (not a reply)
                'created_at' => now()->subDays(rand(0, 30)),
            ]);

            // Add some replies from mentor if resolved
            if ($discussionData['is_resolved']) {
                Discussion::create([
                    'kelas_id' => $kelas->id,
                    'user_id' => $mentor->id,
                    'parent_id' => $discussion->id,
                    'title' => null,
                    'content' => $this->getMentorReply($index),
                    'is_resolved' => false,
                    'created_at' => $discussion->created_at->addHours(rand(1, 24)),
                ]);
            }
        }

        $this->command->info('✅ 10 diskusi dummy berhasil dibuat!');
    }

    private function getMentorReply($index): string
    {
        $replies = [
            'Untuk menginstall npm dengan benar, ikuti langkah berikut: 1. Download Node.js dari nodejs.org 2. Install dengan default settings 3. Verify dengan command "node --version" di terminal. Semoga membantu!',
            'Error ENOENT biasanya terjadi karena package.json tidak ditemukan atau path tidak benar. Pastikan kamu menjalankan npm install di folder yang tepat (folder yang ada package.json nya). Coba lagi dan beri tahu hasilnya.',
            'Singkatnya: var = function scope (sudah jarang dipakai), let = block scope & bisa diubah nilainya, const = block scope & tidak bisa diubah (untuk nilai tetap). Best practice: gunakan const sebisa mungkin, kalau butuh reassign pakai let.',
            'Deploy ke Vercel sangat mudah: 1. Push code ke GitHub 2. Login ke vercel.com 3. Import repository 4. Vercel akan auto-detect React dan deploy otomatis. Semua gratis!',
            'Untuk form validation di React, saya recommend React Hook Form karena performancenya bagus dan API-nya simple. Library ini juga sudah built-in support untuk validation schema seperti Yup atau Zod.',
            'Terima kasih pertanyaannya! Ya betul, di modul 8 kita akan bahas lengkap cara membuat REST API dengan Node.js + Express, termasuk CRUD operations, middleware, dan error handling. Ditunggu ya!',
        ];

        return $replies[($index / 2) % count($replies)];
    }
}
