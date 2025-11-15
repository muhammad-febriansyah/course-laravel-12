<?php

namespace Database\Seeders;

use App\Models\Kelas;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure we have students
        $this->ensureStudents();

        $kelas = Kelas::all();
        $students = User::where('role', 'student')->get();

        if ($kelas->isEmpty()) {
            $this->command?->warn('Tidak ada kelas yang approved. Jalankan KelasSeeder terlebih dahulu.');
            return;
        }

        if ($students->isEmpty()) {
            $this->command?->warn('Tidak ada student. Membuat student dummy...');
            $this->ensureStudents();
            $students = User::where('role', 'student')->get();
        }

        // Create 3-8 reviews for each kelas
        $kelas->each(function ($kelasItem) use ($students) {
            $reviewCount = rand(3, 8);

            // Select random students for this kelas
            $reviewers = $students->random(min($reviewCount, $students->count()));

            foreach ($reviewers as $student) {
                Review::create([
                    'kelas_id' => $kelasItem->id,
                    'user_id' => $student->id,
                    'rating' => rand(3, 5), // Random rating between 3-5 stars
                    'comment' => $this->getRandomReviewComment(),
                    'is_published' => true,
                ]);
            }
        });

        $this->command?->info('ReviewSeeder: Review berhasil dibuat untuk semua kelas.');
    }

    /**
     * Ensure we have student users
     */
    private function ensureStudents(): void
    {
        $reviews = [
            'Budi Santoso',
            'Siti Rahma',
            'Andi Wijaya',
            'Dewi Kusuma',
            'Rudi Hartono',
            'Maya Sari',
            'Agus Permadi',
            'Linda Wijayanti',
            'Fauzi Rahman',
            'Rina Lestari',
        ];

        foreach ($reviews as $index => $name) {
            $email = sprintf('student%02d@demo.test', $index + 1);

            User::firstOrCreate(
                ['email' => $email],
                [
                    'name' => $name,
                    'password' => 'password',
                    'email_verified_at' => now(),
                    'phone' => sprintf('08123456%04d', rand(1000, 9999)),
                    'address' => $this->getRandomAddress(),
                    'role' => 'student',
                    'status' => 1,
                ]
            );
        }
    }

    /**
     * Get random review comment
     */
    private function getRandomReviewComment(): string
    {
        $comments = [
            'Kursus yang sangat bagus! Materinya lengkap dan mudah dipahami. Instruktur menjelaskan dengan detail dan sabar.',
            'Sangat puas dengan kursus ini. Saya belajar banyak hal baru dan langsung bisa praktek di pekerjaan.',
            'Kualitas kursus luar biasa! Video pembelajarannya berkualitas HD dan audionya jernih. Recommended!',
            'Instrukturnya sangat expert di bidangnya. Penjelasannya mudah dipahami bahkan untuk pemula seperti saya.',
            'Worth it banget! Harganya terjangkau tapi materinya sangat berkualitas. Sudah beli 3 kursus di sini.',
            'Terima kasih untuk kursus yang bagus ini. Karir saya meningkat setelah menyelesaikan kursus ini.',
            'Materinya up-to-date dan sesuai dengan kebutuhan industri saat ini. Sangat membantu untuk upgrade skill.',
            'Kursus terbaik yang pernah saya ikuti! Selain materi, support dari instruktur juga sangat baik.',
            'Saya sangat merekomendasikan kursus ini untuk siapa saja yang ingin belajar dari dasar hingga mahir.',
            'Platform yang bagus dengan kursus berkualitas. Sistem belajarnya fleksibel dan bisa diakses kapan saja.',
            'Mantap! Setelah selesai kursus ini saya langsung dapat project freelance. Terima kasih!',
            'Kursus yang comprehensive dan well-structured. Dari basic sampai advanced semua dibahas dengan detail.',
            'Instrukturnya ramah dan responsif menjawab pertanyaan di forum diskusi. Great experience!',
            'Investasi terbaik untuk skill development. Materi kursusnya praktis dan bisa langsung diterapkan.',
            'Sangat puas! Sertifikatnya juga recognized dan bisa dipakai untuk melamar kerja.',
        ];

        return $comments[array_rand($comments)];
    }

    /**
     * Get random address
     */
    private function getRandomAddress(): string
    {
        $streets = [
            'Jl. Sudirman',
            'Jl. Thamrin',
            'Jl. Gatot Subroto',
            'Jl. Rasuna Said',
            'Jl. Kuningan',
        ];

        $cities = [
            'Jakarta Selatan',
            'Jakarta Pusat',
            'Bandung',
            'Surabaya',
            'Yogyakarta',
        ];

        $street = $streets[array_rand($streets)];
        $number = rand(1, 200);
        $city = $cities[array_rand($cities)];

        return sprintf('%s No. %d, %s', $street, $number, $city);
    }
}
