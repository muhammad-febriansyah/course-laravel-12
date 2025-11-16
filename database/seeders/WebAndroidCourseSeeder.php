<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Kelas;
use App\Models\Level;
use App\Models\Quiz;
use App\Models\QuizAnswer;
use App\Models\Section;
use App\Models\Type;
use App\Models\User;
use App\Models\Video;
use Illuminate\Database\Seeder;

class WebAndroidCourseSeeder extends Seeder
{
    public function run(): void
    {
        $this->ensureInstructors();
        $this->ensureCategories();

        $webCategory = Category::where('name', 'Web Development')->first();
        $androidCategory = Category::where('name', 'Android Development')->first();
        $selfPacedType = Type::where('name', 'Self-paced')->first();
        $beginner = Level::where('name', 'Beginner')->first();
        $intermediate = Level::where('name', 'Intermediate')->first();
        $advanced = Level::where('name', 'Advanced')->first();
        $instructors = User::where('email', 'like', 'instructor%')->get();

        if (!$selfPacedType || !$beginner || !$intermediate || !$advanced) {
            $this->command->error('Required types or levels not found!');
            return;
        }

        // Web Development Courses
        $webCourses = [
            [
                'title' => 'HTML & CSS Fundamentals',
                'slug' => 'html-css-fundamentals',
                'desc' => 'Pelajari dasar-dasar HTML dan CSS untuk membuat website yang menarik dan responsif.',
                'body' => 'Kursus ini akan mengajarkan Anda tentang struktur HTML, styling dengan CSS, layout responsif, dan best practices dalam web development.',
                'price' => 199000,
                'discount' => 50000,
                'benefit' => "Menguasai HTML5 dan CSS3\nMembuat website responsif\nMemahami flexbox dan grid\nProject portfolio website\nSertifikat completion",
                'level_id' => $beginner->id,
                'sections' => [
                    ['title' => 'Introduction to HTML', 'videos' => 3],
                    ['title' => 'CSS Basics', 'videos' => 4],
                    ['title' => 'Responsive Design', 'videos' => 3],
                ],
                'quizzes' => [
                    [
                        'question' => 'Apa fungsi dari tag <head> dalam HTML?',
                        'answers' => [
                            ['answer' => 'Menyimpan metadata dan informasi dokumen', 'point' => 10],
                            ['answer' => 'Menampilkan konten utama halaman', 'point' => 0],
                            ['answer' => 'Membuat header navigasi', 'point' => 0],
                            ['answer' => 'Menghubungkan ke database', 'point' => 0],
                        ]
                    ],
                    [
                        'question' => 'Property CSS mana yang digunakan untuk mengubah warna teks?',
                        'answers' => [
                            ['answer' => 'color', 'point' => 10],
                            ['answer' => 'text-color', 'point' => 0],
                            ['answer' => 'font-color', 'point' => 0],
                            ['answer' => 'background-color', 'point' => 0],
                        ]
                    ],
                ]
            ],
            [
                'title' => 'JavaScript for Beginners',
                'slug' => 'javascript-for-beginners',
                'desc' => 'Mulai perjalanan programming Anda dengan mempelajari JavaScript dari nol hingga mahir.',
                'body' => 'Pelajari fundamental JavaScript termasuk variables, functions, DOM manipulation, dan asynchronous programming.',
                'price' => 299000,
                'discount' => 75000,
                'benefit' => "Menguasai JavaScript fundamentals\nDOM manipulation\nES6+ features\nAsync/Await programming\n5 hands-on projects",
                'level_id' => $beginner->id,
                'sections' => [
                    ['title' => 'JavaScript Basics', 'videos' => 5],
                    ['title' => 'Functions and Scope', 'videos' => 4],
                    ['title' => 'DOM Manipulation', 'videos' => 4],
                    ['title' => 'Async JavaScript', 'videos' => 3],
                ],
                'quizzes' => [
                    [
                        'question' => 'Apa perbedaan antara let dan var dalam JavaScript?',
                        'answers' => [
                            ['answer' => 'let memiliki block scope, var memiliki function scope', 'point' => 10],
                            ['answer' => 'Tidak ada perbedaan', 'point' => 0],
                            ['answer' => 'var lebih modern dari let', 'point' => 0],
                            ['answer' => 'let tidak bisa di-reassign', 'point' => 0],
                        ]
                    ],
                ]
            ],
            [
                'title' => 'React.js Complete Guide',
                'slug' => 'reactjs-complete-guide',
                'desc' => 'Pelajari React.js dari dasar hingga advanced untuk membuat aplikasi web modern yang interaktif.',
                'body' => 'Kursus lengkap React.js mencakup components, hooks, state management, routing, dan best practices.',
                'price' => 499000,
                'discount' => 150000,
                'benefit' => "React fundamentals & hooks\nState management dengan Redux\nReact Router\nAPI integration\nDeploy aplikasi ke production",
                'level_id' => $intermediate->id,
                'sections' => [
                    ['title' => 'React Fundamentals', 'videos' => 5],
                    ['title' => 'React Hooks', 'videos' => 6],
                    ['title' => 'State Management', 'videos' => 4],
                    ['title' => 'Routing & Navigation', 'videos' => 3],
                ],
                'quizzes' => [
                    [
                        'question' => 'Hook mana yang digunakan untuk side effects di React?',
                        'answers' => [
                            ['answer' => 'useEffect', 'point' => 10],
                            ['answer' => 'useState', 'point' => 0],
                            ['answer' => 'useContext', 'point' => 0],
                            ['answer' => 'useReducer', 'point' => 0],
                        ]
                    ],
                ]
            ],
            [
                'title' => 'Node.js & Express Backend Development',
                'slug' => 'nodejs-express-backend',
                'desc' => 'Bangun RESTful API yang scalable dan secure menggunakan Node.js dan Express.js.',
                'body' => 'Pelajari backend development dengan Node.js, Express, MongoDB, authentication, dan deployment.',
                'price' => 449000,
                'discount' => 100000,
                'benefit' => "Node.js & Express mastery\nRESTful API design\nMongoDB & Mongoose\nJWT Authentication\nAPI security best practices",
                'level_id' => $intermediate->id,
                'sections' => [
                    ['title' => 'Node.js Basics', 'videos' => 4],
                    ['title' => 'Express Framework', 'videos' => 5],
                    ['title' => 'Database Integration', 'videos' => 4],
                    ['title' => 'Authentication & Security', 'videos' => 4],
                ],
                'quizzes' => [
                    [
                        'question' => 'Apa fungsi middleware dalam Express.js?',
                        'answers' => [
                            ['answer' => 'Menangani request sebelum sampai ke route handler', 'point' => 10],
                            ['answer' => 'Menyimpan data di database', 'point' => 0],
                            ['answer' => 'Membuat routing otomatis', 'point' => 0],
                            ['answer' => 'Mengkompilasi JavaScript', 'point' => 0],
                        ]
                    ],
                ]
            ],
            [
                'title' => 'Full Stack Web Development with MERN',
                'slug' => 'fullstack-mern',
                'desc' => 'Menjadi Full Stack Developer dengan menguasai MongoDB, Express, React, dan Node.js.',
                'body' => 'Kursus komprehensif untuk membangun aplikasi full stack modern dengan MERN stack.',
                'price' => 799000,
                'discount' => 250000,
                'benefit' => "Complete MERN stack mastery\nReal-world project development\nDeployment ke cloud\nContinuous Integration\nCareer guidance",
                'level_id' => $advanced->id,
                'sections' => [
                    ['title' => 'MERN Stack Overview', 'videos' => 3],
                    ['title' => 'Building the Backend', 'videos' => 6],
                    ['title' => 'Frontend with React', 'videos' => 6],
                    ['title' => 'Integration & Deployment', 'videos' => 4],
                ],
                'quizzes' => [
                    [
                        'question' => 'Komponen mana yang bertanggung jawab untuk database di MERN stack?',
                        'answers' => [
                            ['answer' => 'MongoDB', 'point' => 10],
                            ['answer' => 'Express', 'point' => 0],
                            ['answer' => 'React', 'point' => 0],
                            ['answer' => 'Node.js', 'point' => 0],
                        ]
                    ],
                ]
            ],
        ];

        // Android Development Courses
        $androidCourses = [
            [
                'title' => 'Android Development Fundamentals',
                'slug' => 'android-fundamentals',
                'desc' => 'Mulai membuat aplikasi Android dengan Kotlin dari dasar hingga publish ke Play Store.',
                'body' => 'Pelajari dasar-dasar Android development dengan Kotlin, UI design, dan lifecycle management.',
                'price' => 349000,
                'discount' => 100000,
                'benefit' => "Kotlin programming\nAndroid Studio mastery\nUI/UX design\nPublish ke Play Store\n3 aplikasi project",
                'level_id' => $beginner->id,
                'sections' => [
                    ['title' => 'Introduction to Android', 'videos' => 4],
                    ['title' => 'Kotlin Basics', 'videos' => 5],
                    ['title' => 'Android UI Components', 'videos' => 5],
                    ['title' => 'Activities & Fragments', 'videos' => 4],
                ],
                'quizzes' => [
                    [
                        'question' => 'Apa bahasa pemrograman resmi untuk Android development?',
                        'answers' => [
                            ['answer' => 'Kotlin', 'point' => 10],
                            ['answer' => 'Java', 'point' => 5],
                            ['answer' => 'Swift', 'point' => 0],
                            ['answer' => 'Python', 'point' => 0],
                        ]
                    ],
                ]
            ],
            [
                'title' => 'Jetpack Compose Modern UI',
                'slug' => 'jetpack-compose-ui',
                'desc' => 'Bangun UI Android yang modern dan reaktif dengan Jetpack Compose.',
                'body' => 'Pelajari Jetpack Compose untuk membuat UI Android yang declarative, modern, dan maintainable.',
                'price' => 449000,
                'discount' => 120000,
                'benefit' => "Jetpack Compose fundamentals\nState management\nMaterial Design 3\nAnimation & gestures\nResponsive layouts",
                'level_id' => $intermediate->id,
                'sections' => [
                    ['title' => 'Compose Basics', 'videos' => 5],
                    ['title' => 'Layouts & Modifiers', 'videos' => 4],
                    ['title' => 'State & Side Effects', 'videos' => 4],
                    ['title' => 'Navigation & Architecture', 'videos' => 3],
                ],
                'quizzes' => [
                    [
                        'question' => 'Apa keuntungan menggunakan Jetpack Compose dibanding XML?',
                        'answers' => [
                            ['answer' => 'Declarative UI yang lebih mudah dimaintain', 'point' => 10],
                            ['answer' => 'Lebih cepat compile time', 'point' => 0],
                            ['answer' => 'Tidak ada keuntungan', 'point' => 0],
                            ['answer' => 'Hanya untuk aplikasi kecil', 'point' => 0],
                        ]
                    ],
                ]
            ],
            [
                'title' => 'Android MVVM Architecture',
                'slug' => 'android-mvvm-architecture',
                'desc' => 'Pelajari arsitektur MVVM untuk membuat aplikasi Android yang scalable dan testable.',
                'body' => 'Implementasi MVVM pattern dengan ViewModel, LiveData, Room Database, dan Retrofit.',
                'price' => 399000,
                'discount' => 100000,
                'benefit' => "MVVM pattern mastery\nRoom Database\nRetrofit API integration\nDependency injection\nUnit testing",
                'level_id' => $intermediate->id,
                'sections' => [
                    ['title' => 'MVVM Architecture Overview', 'videos' => 3],
                    ['title' => 'ViewModel & LiveData', 'videos' => 4],
                    ['title' => 'Room Database', 'videos' => 4],
                    ['title' => 'Repository Pattern', 'videos' => 3],
                ],
                'quizzes' => [
                    [
                        'question' => 'Komponen mana yang mengelola UI state di MVVM?',
                        'answers' => [
                            ['answer' => 'ViewModel', 'point' => 10],
                            ['answer' => 'View', 'point' => 0],
                            ['answer' => 'Model', 'point' => 0],
                            ['answer' => 'Repository', 'point' => 0],
                        ]
                    ],
                ]
            ],
            [
                'title' => 'Android Firebase Integration',
                'slug' => 'android-firebase',
                'desc' => 'Integrasikan Firebase untuk authentication, database, dan cloud messaging di aplikasi Android.',
                'body' => 'Pelajari Firebase Authentication, Firestore, Storage, Cloud Messaging, dan Analytics.',
                'price' => 349000,
                'discount' => 90000,
                'benefit' => "Firebase Authentication\nCloud Firestore\nCloud Storage\nPush Notifications\nAnalytics & Crashlytics",
                'level_id' => $intermediate->id,
                'sections' => [
                    ['title' => 'Firebase Setup', 'videos' => 3],
                    ['title' => 'Authentication', 'videos' => 4],
                    ['title' => 'Firestore Database', 'videos' => 5],
                    ['title' => 'Cloud Messaging', 'videos' => 3],
                ],
                'quizzes' => [
                    [
                        'question' => 'Database NoSQL mana yang disediakan Firebase untuk Android?',
                        'answers' => [
                            ['answer' => 'Cloud Firestore', 'point' => 10],
                            ['answer' => 'Realtime Database', 'point' => 5],
                            ['answer' => 'MongoDB', 'point' => 0],
                            ['answer' => 'SQLite', 'point' => 0],
                        ]
                    ],
                ]
            ],
            [
                'title' => 'Advanced Android Development',
                'slug' => 'advanced-android',
                'desc' => 'Tingkatkan skill Android development dengan advanced topics dan best practices.',
                'body' => 'Pelajari Coroutines, Flow, WorkManager, custom views, performance optimization, dan security.',
                'price' => 599000,
                'discount' => 180000,
                'benefit' => "Kotlin Coroutines & Flow\nWorkManager\nCustom Views\nPerformance optimization\nSecurity best practices",
                'level_id' => $advanced->id,
                'sections' => [
                    ['title' => 'Coroutines & Flow', 'videos' => 5],
                    ['title' => 'Background Processing', 'videos' => 4],
                    ['title' => 'Custom Views & Canvas', 'videos' => 4],
                    ['title' => 'Performance & Security', 'videos' => 4],
                ],
                'quizzes' => [
                    [
                        'question' => 'Untuk background task yang dijadwalkan, komponen apa yang direkomendasikan?',
                        'answers' => [
                            ['answer' => 'WorkManager', 'point' => 10],
                            ['answer' => 'AsyncTask', 'point' => 0],
                            ['answer' => 'Thread', 'point' => 0],
                            ['answer' => 'Handler', 'point' => 0],
                        ]
                    ],
                ]
            ],
        ];

        // Create Web Development Courses
        foreach ($webCourses as $courseData) {
            $this->createCourse($courseData, $webCategory, $selfPacedType, $instructors);
        }

        // Create Android Development Courses
        foreach ($androidCourses as $courseData) {
            $this->createCourse($courseData, $androidCategory, $selfPacedType, $instructors);
        }

        $this->command->info('Successfully created 10 courses (5 Web Dev + 5 Android Dev) with sections, videos, and quizzes!');
    }

    private function createCourse(array $data, $category, $type, $instructors): void
    {
        $kelas = Kelas::create([
            'title' => $data['title'],
            'slug' => $data['slug'],
            'desc' => $data['desc'],
            'body' => $data['body'],
            'price' => $data['price'],
            'discount' => $data['discount'],
            'benefit' => $data['benefit'],
            'category_id' => $category->id,
            'type_id' => $type->id,
            'level_id' => $data['level_id'],
            'user_id' => $instructors->random()->id,
            'status' => 'approved',
            'image' => 'kelas/' . $data['slug'] . '.jpg',
        ]);

        // Create sections and videos
        foreach ($data['sections'] as $sectionData) {
            $section = Section::create([
                'kelas_id' => $kelas->id,
                'title' => $sectionData['title'],
            ]);

            for ($i = 1; $i <= $sectionData['videos']; $i++) {
                Video::create([
                    'section_id' => $section->id,
                    'title' => $sectionData['title'] . ' - Part ' . $i,
                    'video' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Dummy video URL
                ]);
            }
        }

        // Create quizzes with answers
        foreach ($data['quizzes'] as $quizData) {
            $quiz = Quiz::create([
                'kelas_id' => $kelas->id,
                'question' => $quizData['question'],
            ]);

            foreach ($quizData['answers'] as $answerData) {
                QuizAnswer::create([
                    'quiz_id' => $quiz->id,
                    'answer' => $answerData['answer'],
                    'point' => $answerData['point'],
                ]);
            }
        }
    }

    private function ensureInstructors(): void
    {
        foreach (range(1, 3) as $index) {
            $email = sprintf('instructor%02d@demo.test', $index);

            User::firstOrCreate(
                ['email' => $email],
                [
                    'name' => 'Instructor ' . $index,
                    'password' => bcrypt('password'),
                    'email_verified_at' => now(),
                    'role' => 'instructor',
                    'status' => 1,
                ]
            );
        }
    }

    private function ensureCategories(): void
    {
        Category::firstOrCreate(
            ['name' => 'Web Development'],
            ['slug' => 'web-development', 'image' => 'categories/web-dev.png']
        );
        Category::firstOrCreate(
            ['name' => 'Android Development'],
            ['slug' => 'android-development', 'image' => 'categories/android-dev.png']
        );
    }
}
