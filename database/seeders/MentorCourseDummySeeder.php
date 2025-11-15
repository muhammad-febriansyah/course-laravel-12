<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Kelas;
use App\Models\Level;
use App\Models\Quiz;
use App\Models\QuizAnswer;
use App\Models\Review;
use App\Models\Type;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class MentorCourseDummySeeder extends Seeder
{
    public function run(): void
    {
        $mentor = $this->ensureMentor();

        $categories = $this->ensureCategories();
        $types = $this->ensureTypes();
        $levels = $this->ensureLevels();

        $courses = $this->courseBlueprint();

        foreach ($courses as $course) {
            $category = $categories[$course['category']];
            $type = $types[$course['type']];
            $level = $levels[$course['level']];

            $kelas = Kelas::updateOrCreate(
                ['slug' => $course['slug']],
                [
                    'category_id' => $category->id,
                    'type_id' => $type->id,
                    'level_id' => $level->id,
                    'user_id' => $mentor->id,
                    'title' => $course['title'],
                    'price' => $course['price'],
                    'discount' => $course['discount'],
                    'benefit' => implode("\n", $course['benefits']),
                    'desc' => $course['short_description'],
                    'body' => $course['body'],
                    'image' => $course['image'],
                    'status' => 'approved',
                    'approved_at' => now(),
                    'views' => $course['views'],
                ],
            );

            $this->seedQuizzes($kelas, $course['quizzes']);
            $this->seedReviews($kelas, $course['reviews']);
        }
    }

    private function ensureMentor(): User
    {
        return User::updateOrCreate(
            ['id' => 3],
            [
                'name' => 'Mentor Digital',
                'email' => 'mentor.digital@example.com',
                'password' => Hash::make('mentor123'),
                'email_verified_at' => now(),
                'role' => 'mentor',
                'status' => 1,
            ],
        );
    }

    /**
     * @return array<string, Category>
     */
    private function ensureCategories(): array
    {
        $categories = [
            'pengembangan-web' => 'Pengembangan Web',
            'desain-grafis' => 'Desain Grafis',
            'data' => 'Analisis Data',
            'productivity' => 'Produktivitas Digital',
            'marketing' => 'Pemasaran Digital',
        ];

        $result = [];

        foreach ($categories as $slug => $name) {
            $result[$slug] = Category::updateOrCreate(
                ['slug' => $slug],
                [
                    'name' => $name,
                    'image' => $this->placeholderImage($name),
                ],
            );
        }

        return $result;
    }

    /**
     * @return array<string, Type>
     */
    private function ensureTypes(): array
    {
        $types = [
            'bootcamp' => 'Bootcamp',
            'microlearning' => 'Microlearning',
            'workshop' => 'Workshop Intensif',
        ];

        $result = [];

        foreach ($types as $slug => $name) {
            $result[$slug] = Type::updateOrCreate(
                ['slug' => $slug],
                [
                    'name' => $name,
                    'image' => $this->placeholderImage($name),
                ],
            );
        }

        return $result;
    }

    /**
     * @return array<string, Level>
     */
    private function ensureLevels(): array
    {
        $levels = [
            'pemula' => 'Pemula',
            'menengah' => 'Menengah',
            'lanjutan' => 'Lanjutan',
        ];

        $result = [];

        foreach ($levels as $key => $name) {
            $result[$key] = Level::updateOrCreate(
                ['name' => $name],
                ['image' => $this->placeholderImage($name)],
            );
        }

        return $result;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function courseBlueprint(): array
    {
        return [
            [
                'title' => 'Fundamental Pengembangan Web Modern',
                'slug' => Str::slug('Fundamental Pengembangan Web Modern'),
                'category' => 'pengembangan-web',
                'type' => 'bootcamp',
                'level' => 'pemula',
                'price' => '850000',
                'discount' => '150000',
                'short_description' => 'Belajar dasar HTML, CSS, dan JavaScript untuk membangun website responsif pertama Anda.',
                'body' => '<p>Program ini dirancang untuk membantu pemula memahami konsep fundamental pengembangan web modern. Mulai dari struktur HTML, styling dengan CSS, hingga interaktivitas menggunakan JavaScript vanilla.</p><p>Setiap modul dilengkapi dengan studi kasus dan proyek mini yang dapat langsung diterapkan.</p>',
                'benefits' => [
                    'Modul pembelajaran terstruktur dengan studi kasus nyata',
                    'Akses forum diskusi mentor dan komunitas',
                    'Sertifikat penyelesaian resmi SkillUp',
                    'Source code proyek siap dimodifikasi',
                ],
                'image' => $this->courseImage('Fundamental Web'),
                'views' => 3180,
                'quizzes' => [
                    [
                        'question' => 'Apa fungsi utama dari elemen &lt;head&gt; pada dokumen HTML?',
                        'options' => [
                            'Menampilkan konten utama halaman',
                            'Menyimpan informasi meta dan pemanggilan resource',
                            'Mengatur struktur grid pada halaman',
                            'Menampilkan footer website',
                        ],
                        'correct' => 'Menyimpan informasi meta dan pemanggilan resource',
                        'point' => 10,
                    ],
                    [
                        'question' => 'Property CSS apa yang digunakan untuk membuat layout fleksibel responsif?',
                        'options' => ['display: grid', 'display: inline', 'display: flex', 'display: table'],
                        'correct' => 'display: flex',
                        'point' => 10,
                    ],
                    [
                        'question' => 'Metode JavaScript apa yang digunakan untuk memilih elemen berdasarkan class?',
                        'options' => ['document.getElementById', 'document.querySelector', 'document.createElement', 'document.write'],
                        'correct' => 'document.querySelector',
                        'point' => 10,
                    ],
                ],
                'reviews' => [
                    [
                        'email' => 'ayu.pratiwi@example.com',
                        'name' => 'Ayu Pratiwi',
                        'rating' => 5,
                        'comment' => 'Materi sangat terstruktur. Saya yang sebelumnya nol pengalaman sekarang sudah bisa membuat landing page sendiri.',
                    ],
                    [
                        'email' => 'indra.maulana@example.com',
                        'name' => 'Indra Maulana',
                        'rating' => 4,
                        'comment' => 'Penjelasan mentor mudah dipahami, terutama bagian fleksibel layout. Terima kasih mentor!',
                    ],
                ],
            ],
            [
                'title' => 'UI/UX Design untuk Produk Digital',
                'slug' => Str::slug('UI UX Design untuk Produk Digital'),
                'category' => 'desain-grafis',
                'type' => 'bootcamp',
                'level' => 'menengah',
                'price' => '990000',
                'discount' => '200000',
                'short_description' => 'Pelajari proses end-to-end mendesain antarmuka dan pengalaman pengguna aplikasi digital.',
                'body' => '<p>Kelas UI/UX ini mengupas tuntas proses riset pengguna, pembuatan wireframe, prototyping, hingga usability testing. Setiap peserta akan mengerjakan studi kasus desain aplikasi mobile.</p>',
                'benefits' => [
                    'Template riset dan usability testing',
                    'Feedback desain langsung dari mentor',
                    'Akses toolkit Figma dan komponen siap pakai',
                    'Portofolio akhir berupa prototype interaktif',
                ],
                'image' => $this->courseImage('UI UX Digital'),
                'views' => 2870,
                'quizzes' => [
                    [
                        'question' => 'Tahapan pertama yang ideal dalam proses desain UX adalah?',
                        'options' => ['Prototyping', 'User Research', 'Usability Testing', 'UI Design'],
                        'correct' => 'User Research',
                        'point' => 10,
                    ],
                    [
                        'question' => 'Apa tujuan utama dari usability testing?',
                        'options' => [
                            'Menentukan skema warna',
                            'Menilai performa aplikasi',
                            'Mengukur kemudahan penggunaan oleh pengguna',
                            'Meningkatkan ranking SEO',
                        ],
                        'correct' => 'Mengukur kemudahan penggunaan oleh pengguna',
                        'point' => 10,
                    ],
                ],
                'reviews' => [
                    [
                        'email' => 'sari.widjaja@example.com',
                        'name' => 'Sari Widjaja',
                        'rating' => 5,
                        'comment' => 'Suka banget sama sesi usability testing, bikin saya sadar banyak asumsi yang salah.',
                    ],
                    [
                        'email' => 'alfian.hidayat@example.com',
                        'name' => 'Alfian Hidayat',
                        'rating' => 4,
                        'comment' => 'Materinya lengkap, tinggal dipraktikkan ke project kantor. Mentor responsif banget di forum.',
                    ],
                ],
            ],
            [
                'title' => 'Analisis Data dengan Python untuk Bisnis',
                'slug' => Str::slug('Analisis Data dengan Python untuk Bisnis'),
                'category' => 'data',
                'type' => 'bootcamp',
                'level' => 'menengah',
                'price' => '1150000',
                'discount' => '250000',
                'short_description' => 'Belajar mengolah dan memvisualisasi data bisnis menggunakan Python, Pandas, dan Matplotlib.',
                'body' => '<p>Kursus ini cocok untuk analis bisnis yang ingin melakukan data crunching secara mandiri. Kita akan mempelajari pembersihan data, exploratory data analysis, hingga membuat dashboard sederhana.</p>',
                'benefits' => [
                    'Dataset bisnis autentik untuk latihan',
                    'Notebook contoh siap pakai',
                    'Checklist proses analisis end-to-end',
                    'Pendampingan tugas akhir berupa studi kasus',
                ],
                'image' => $this->courseImage('Analisis Data Python'),
                'views' => 3540,
                'quizzes' => [
                    [
                        'question' => 'Library Python apa yang umum dipakai untuk manipulasi data tabular?',
                        'options' => ['NumPy', 'Pandas', 'Matplotlib', 'Seaborn'],
                        'correct' => 'Pandas',
                        'point' => 10,
                    ],
                    [
                        'question' => 'Fungsi Pandas apa yang digunakan untuk melihat 5 baris pertama dari DataFrame?',
                        'options' => ['df.head()', 'df.sample()', 'df.tail()', 'df.info()'],
                        'correct' => 'df.head()',
                        'point' => 10,
                    ],
                    [
                        'question' => 'Apa tujuan utama dari exploratory data analysis?',
                        'options' => [
                            'Membangun model machine learning',
                            'Memahami pola dan anomali pada data',
                            'Mengembangkan API',
                            'Membuat aplikasi mobile',
                        ],
                        'correct' => 'Memahami pola dan anomali pada data',
                        'point' => 10,
                    ],
                ],
                'reviews' => [
                    [
                        'email' => 'rita.anindya@example.com',
                        'name' => 'Rita Anindya',
                        'rating' => 5,
                        'comment' => 'Penjelasan tentang data cleaning sangat membantu. Sekarang laporan bulanan saya jauh lebih rapi.',
                    ],
                    [
                        'email' => 'erwin.putra@example.com',
                        'name' => 'Erwin Putra',
                        'rating' => 4,
                        'comment' => 'Latihan visualisasi datanya seru, langsung bisa dipakai buat presentasi ke stakeholder.',
                    ],
                ],
            ],
            [
                'title' => 'Pengembangan Aplikasi Mobile Flutter',
                'slug' => Str::slug('Pengembangan Aplikasi Mobile Flutter'),
                'category' => 'pengembangan-web',
                'type' => 'bootcamp',
                'level' => 'menengah',
                'price' => '1250000',
                'discount' => '300000',
                'short_description' => 'Bangun aplikasi mobile multi-platform dengan Flutter, dari setup hingga deployment.',
                'body' => '<p>Materi mencakup state management, integrasi API, hingga deployment ke Play Store. Cocok bagi developer yang ingin memperluas skill mobile development.</p>',
                'benefits' => [
                    'Template project Flutter siap pakai',
                    'Sesi live code dengan mentor',
                    'Studi kasus aplikasi marketplace sederhana',
                    'Checklist publikasi aplikasi ke store',
                ],
                'image' => $this->courseImage('Flutter Mobile'),
                'views' => 2980,
                'quizzes' => [
                    [
                        'question' => 'Bahasa pemrograman apa yang digunakan Flutter?',
                        'options' => ['Dart', 'Kotlin', 'JavaScript', 'Swift'],
                        'correct' => 'Dart',
                        'point' => 10,
                    ],
                    [
                        'question' => 'Widget apa yang digunakan untuk layout vertikal?',
                        'options' => ['Row', 'Column', 'Stack', 'ListView'],
                        'correct' => 'Column',
                        'point' => 10,
                    ],
                ],
                'reviews' => [
                    [
                        'email' => 'nurul.hidayah@example.com',
                        'name' => 'Nurul Hidayah',
                        'rating' => 5,
                        'comment' => 'Akhirnya bisa publish app portofolio sendiri. Mentor sabar banget waktu Q&A.',
                    ],
                ],
            ],
            [
                'title' => 'Copywriting untuk Media Sosial',
                'slug' => Str::slug('Copywriting untuk Media Sosial'),
                'category' => 'marketing',
                'type' => 'microlearning',
                'level' => 'pemula',
                'price' => '450000',
                'discount' => '90000',
                'short_description' => 'Pelajari teknik menulis caption dan script konten sosial media yang memikat audiens.',
                'body' => '<p>Cocok untuk social media specialist maupun UMKM yang ingin meningkatkan engagement. Materi mencakup storytelling, pemilihan CTA, dan analisis performa konten.</p>',
                'benefits' => [
                    'Template kalender konten',
                    'Daftar ide konten evergreen',
                    'Akses grup review copy mingguan',
                ],
                'image' => $this->courseImage('Copywriting Media Sosial'),
                'views' => 2140,
                'quizzes' => [
                    [
                        'question' => 'Apa tujuan utama dari call to action pada caption?',
                        'options' => [
                            'Menghias caption agar terlihat panjang',
                            'Mengajak audiens melakukan tindakan',
                            'Mengisi ruang kosong di konten',
                            'Meningkatkan kualitas gambar',
                        ],
                        'correct' => 'Mengajak audiens melakukan tindakan',
                        'point' => 10,
                    ],
                ],
                'reviews' => [
                    [
                        'email' => 'melisa.kartika@example.com',
                        'name' => 'Melisa Kartika',
                        'rating' => 4,
                        'comment' => 'Strategi konten B2C-nya sangat membantu. Engagement toko online saya naik drastis.',
                    ],
                ],
            ],
            [
                'title' => 'Manajemen Proyek Agile dengan Trello',
                'slug' => Str::slug('Manajemen Proyek Agile dengan Trello'),
                'category' => 'productivity',
                'type' => 'microlearning',
                'level' => 'pemula',
                'price' => '380000',
                'discount' => '80000',
                'short_description' => 'Optimalkan workflow tim menggunakan prinsip agile dan automasi Trello.',
                'body' => '<p>Pelajari bagaimana membuat board Trello yang efektif untuk tim kecil. Materi meliputi sprint planning, card workflow, dan integrasi automasi sederhana.</p>',
                'benefits' => [
                    'Template board Trello siap pakai',
                    'Checklist daily stand-up',
                    'Panduan automasi Trello Power-Up',
                ],
                'image' => $this->courseImage('Agile Trello'),
                'views' => 1760,
                'quizzes' => [
                    [
                        'question' => 'Dalam metodologi agile, meeting singkat harian disebut?',
                        'options' => ['Sprint Review', 'Retrospective', 'Daily Stand-up', 'Backlog Grooming'],
                        'correct' => 'Daily Stand-up',
                        'point' => 10,
                    ],
                ],
                'reviews' => [
                    [
                        'email' => 'agus.saputra@example.com',
                        'name' => 'Agus Saputra',
                        'rating' => 4,
                        'comment' => 'Setelah ikut kelas ini, workflow tim marketing jadi jauh lebih tertata.',
                    ],
                ],
            ],
            [
                'title' => 'Strategi SEO Konten untuk Website',
                'slug' => Str::slug('Strategi SEO Konten untuk Website'),
                'category' => 'marketing',
                'type' => 'workshop',
                'level' => 'menengah',
                'price' => '780000',
                'discount' => '120000',
                'short_description' => 'Kuasai riset keyword, penulisan konten SEO, dan optimasi teknis dasar.',
                'body' => '<p>Workshop intensif dua hari dengan fokus pada riset keyword praktis, penulisan konten SEO-friendly, serta audit teknis ringan yang dapat dilakukan sendiri.</p>',
                'benefits' => [
                    'Template riset keyword dan konten pillar',
                    'Tool rekomendasi audit SEO gratis',
                    'Sesi review artikel oleh mentor',
                ],
                'image' => $this->courseImage('SEO Konten'),
                'views' => 2650,
                'quizzes' => [
                    [
                        'question' => 'Apa itu keyword density?',
                        'options' => [
                            'Jumlah total kata pada artikel',
                            'Persentase kemunculan keyword dibanding total kata',
                            'Jumlah backlink pada artikel',
                            'Peringkat artikel di Google',
                        ],
                        'correct' => 'Persentase kemunculan keyword dibanding total kata',
                        'point' => 10,
                    ],
                ],
                'reviews' => [
                    [
                        'email' => 'dina.prameswari@example.com',
                        'name' => 'Dina Prameswari',
                        'rating' => 5,
                        'comment' => 'Artikel blog saya naik ke halaman pertama Google setelah menerapkan tips di kelas ini.',
                    ],
                ],
            ],
            [
                'title' => 'Desain Presentasi Profesional dengan Canva',
                'slug' => Str::slug('Desain Presentasi Profesional dengan Canva'),
                'category' => 'desain-grafis',
                'type' => 'microlearning',
                'level' => 'pemula',
                'price' => '320000',
                'discount' => '60000',
                'short_description' => 'Buat slide presentasi profesional meski tanpa pengalaman desain grafis.',
                'body' => '<p>Kelas singkat yang mengajarkan prinsip desain slide, tipografi, dan storytelling visual menggunakan Canva. Disertai template siap pakai untuk berbagai kebutuhan.</p>',
                'benefits' => [
                    'Template presentasi multi-industri',
                    'Checklist desain slide efektif',
                    'Akses komunitas review desain',
                ],
                'image' => $this->courseImage('Desain Presentasi'),
                'views' => 1980,
                'quizzes' => [
                    [
                        'question' => 'Apa prinsip utama memilih kombinasi warna yang serasi?',
                        'options' => ['Menggunakan warna sebanyak mungkin', 'Mengikuti color wheel', 'Menghindari kontras', 'Memakai warna random'],
                        'correct' => 'Mengikuti color wheel',
                        'point' => 10,
                    ],
                ],
                'reviews' => [
                    [
                        'email' => 'linda.nugroho@example.com',
                        'name' => 'Linda Nugroho',
                        'rating' => 5,
                        'comment' => 'Template yang diberikan tinggal pakai. Presentasi kerja saya jadi lebih profesional.',
                    ],
                ],
            ],
            [
                'title' => 'Creative Coding dengan JavaScript Canvas',
                'slug' => Str::slug('Creative Coding dengan JavaScript Canvas'),
                'category' => 'pengembangan-web',
                'type' => 'workshop',
                'level' => 'lanjutan',
                'price' => '990000',
                'discount' => '210000',
                'short_description' => 'Eksplorasi animasi interaktif dan visualisasi kreatif menggunakan Canvas API.',
                'body' => '<p>Kelas ini cocok bagi front-end developer yang ingin membuat efek visual menawan. Kita akan mempelajari animasi partikel, audio visualizer, hingga generative art.</p>',
                'benefits' => [
                    'Snippet animasi siap pakai',
                    'Proyek akhir berupa visual interaktif',
                    'Akses komunitas creative coder',
                ],
                'image' => $this->courseImage('Creative Coding'),
                'views' => 1420,
                'quizzes' => [
                    [
                        'question' => 'Metode Canvas 2D apa yang digunakan untuk menggambar lingkaran?',
                        'options' => ['fillRect', 'arc', 'lineTo', 'strokeText'],
                        'correct' => 'arc',
                        'point' => 10,
                    ],
                ],
                'reviews' => [
                    [
                        'email' => 'angga.prakoso@example.com',
                        'name' => 'Angga Prakoso',
                        'rating' => 5,
                        'comment' => 'Project generative art di akhir kelas bikin portofolio saya stand out.',
                    ],
                ],
            ],
            [
                'title' => 'Manajemen Produk Digital untuk Startup',
                'slug' => Str::slug('Manajemen Produk Digital untuk Startup'),
                'category' => 'productivity',
                'type' => 'bootcamp',
                'level' => 'menengah',
                'price' => '1350000',
                'discount' => '300000',
                'short_description' => 'Kuasi lifecycle manajemen produk mulai dari discovery hingga delivery.',
                'body' => '<p>Belajar menyusun product roadmap, memprioritaskan backlog, dan mengukur keberhasilan produk menggunakan metric relevan. Disertai studi kasus startup lokal.</p>',
                'benefits' => [
                    'Template roadmap dan backlog prioritas',
                    'Checklist product discovery',
                    'Mentoring 1-on-1 untuk final project',
                ],
                'image' => $this->courseImage('Manajemen Produk'),
                'views' => 3200,
                'quizzes' => [
                    [
                        'question' => 'Framework prioritas backlog yang membandingkan value dan effort adalah?',
                        'options' => ['RICE', 'KANO', 'Lean Canvas', 'SWOT'],
                        'correct' => 'RICE',
                        'point' => 10,
                    ],
                ],
                'reviews' => [
                    [
                        'email' => 'yuliana.setiawan@example.com',
                        'name' => 'Yuliana Setiawan',
                        'rating' => 5,
                        'comment' => 'Framework RICE dan template discovery-nya langsung saya pakai di startup kantor. Sangat membantu!',
                    ],
                    [
                        'email' => 'raffi.pangestu@example.com',
                        'name' => 'Raffi Pangestu',
                        'rating' => 4,
                        'comment' => 'Mentor memberi feedback detail pada final project saya. Worth every penny.',
                    ],
                ],
            ],
        ];
    }

    private function seedQuizzes(Kelas $kelas, array $quizzes): void
    {
        foreach ($quizzes as $quiz) {
            $quizModel = Quiz::updateOrCreate(
                [
                    'kelas_id' => $kelas->id,
                    'question' => $quiz['question'],
                ],
                [
                    'point' => $quiz['point'] ?? 10,
                ],
            );

            $answerIds = [];

            foreach ($quiz['options'] as $option) {
                $isCorrect = $option === $quiz['correct'];

                $answer = QuizAnswer::updateOrCreate(
                    [
                        'quiz_id' => $quizModel->id,
                        'answer' => $option,
                    ],
                    [
                        'point' => $isCorrect ? ($quiz['point'] ?? 10) : 0,
                    ],
                );

                $answerIds[] = $answer->id;
            }

            if (! empty($answerIds)) {
                QuizAnswer::where('quiz_id', $quizModel->id)
                    ->whereNotIn('id', $answerIds)
                    ->delete();
            }
        }
    }

    private function seedReviews(Kelas $kelas, array $reviews): void
    {
        foreach ($reviews as $reviewData) {
            $student = User::firstOrCreate(
                ['email' => $reviewData['email']],
                [
                    'name' => $reviewData['name'],
                    'password' => Hash::make('student123'),
                    'email_verified_at' => now(),
                    'role' => 'student',
                    'status' => 1,
                    'address' => 'Jakarta, Indonesia',
                ],
            );

            Review::updateOrCreate(
                [
                    'kelas_id' => $kelas->id,
                    'user_id' => $student->id,
                ],
                [
                    'rating' => Arr::get($reviewData, 'rating', 5),
                    'comment' => Arr::get($reviewData, 'comment', ''),
                    'is_published' => true,
                ],
            );
        }
    }

    private function placeholderImage(string $label): string
    {
        return 'https://placehold.co/600x400?text=' . rawurlencode($label);
    }

    private function courseImage(string $label): string
    {
        return 'https://placehold.co/1200x800?text=' . rawurlencode($label);
    }
}
