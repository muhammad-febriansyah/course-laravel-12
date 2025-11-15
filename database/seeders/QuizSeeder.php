<?php

namespace Database\Seeders;

use App\Models\Kelas;
use App\Models\Quiz;
use App\Models\QuizAnswer;
use Illuminate\Database\Seeder;

class QuizSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $quizzes = [
            [
                'question' => 'Directive Blade apa yang digunakan untuk melakukan perulangan pada koleksi data?',
                'options' => ['@foreach', '@if', '@include', '@csrf'],
                'correct' => '@foreach',
                'point' => 10,
            ],
            [
                'question' => 'Perintah artisan apa yang digunakan untuk menjalankan migrasi database?',
                'options' => [
                    'php artisan migrate',
                    'php artisan db:seed',
                    'php artisan make:migration',
                    'php artisan migrate:rollback',
                ],
                'correct' => 'php artisan migrate',
                'point' => 10,
            ],
            [
                'question' => 'Metode Eloquent mana yang digunakan untuk eager loading relasi?',
                'options' => ['with', 'loadMissing', 'attach', 'pluck'],
                'correct' => 'with',
                'point' => 10,
            ],
            [
                'question' => 'Kode status HTTP apa yang menandakan resource berhasil dibuat?',
                'options' => ['200 OK', '201 Created', '204 No Content', '400 Bad Request'],
                'correct' => '201 Created',
                'point' => 10,
            ],
            [
                'question' => 'Pada SQL, klausa apa yang digunakan untuk memfilter hasil query sebelum dikembalikan?',
                'options' => ['WHERE', 'GROUP BY', 'ORDER BY', 'LIMIT'],
                'correct' => 'WHERE',
                'point' => 10,
            ],
            [
                'question' => 'Perintah Git apa yang digunakan untuk membuat dan langsung berpindah ke branch baru?',
                'options' => [
                    'git checkout -b feature-login',
                    'git merge feature-login',
                    'git init feature-login',
                    'git branch --list',
                ],
                'correct' => 'git checkout -b feature-login',
                'point' => 10,
            ],
            [
                'question' => 'Fitur TypeScript apa yang digunakan untuk menentukan struktur objek secara eksplisit?',
                'options' => ['interface', 'enum', 'namespace', 'type inference'],
                'correct' => 'interface',
                'point' => 10,
            ],
            [
                'question' => 'Properti CSS apa yang digunakan untuk mengubah elemen menjadi flex container?',
                'options' => ['display: flex', 'justify-content', 'align-items', 'flex-wrap'],
                'correct' => 'display: flex',
                'point' => 10,
            ],
            [
                'question' => 'Hook React mana yang digunakan untuk menyimpan state lokal pada komponen fungsional?',
                'options' => ['useState', 'useEffect', 'useMemo', 'useRef'],
                'correct' => 'useState',
                'point' => 10,
            ],
            [
                'question' => 'Metode HTTP apa yang umum digunakan untuk memperbarui sebagian data pada REST API?',
                'options' => ['GET', 'POST', 'PATCH', 'DELETE'],
                'correct' => 'PATCH',
                'point' => 10,
            ],
        ];

        $kelasIds = Kelas::pluck('id')->all();

        if (empty($kelasIds)) {
            $kelasIds[] = Kelas::factory()->create()->id;
        }

        $kelasCount = count($kelasIds);

        foreach ($quizzes as $index => $data) {
            $kelasId = $kelasIds[$index % $kelasCount];

            $quiz = Quiz::updateOrCreate(
                [
                    'kelas_id' => $kelasId,
                    'question' => $data['question'],
                ],
                [
                    'point' => $data['point'],
                ],
            );

            $answerIds = [];

            foreach ($data['options'] as $option) {
                $isCorrect = $option === $data['correct'];

                $answer = QuizAnswer::updateOrCreate(
                    [
                        'quiz_id' => $quiz->id,
                        'answer' => $option,
                    ],
                    [
                        'point' => $isCorrect ? $data['point'] : 0,
                    ],
                );

                $answerIds[] = $answer->id;
            }

            if (! empty($answerIds)) {
                QuizAnswer::where('quiz_id', $quiz->id)
                    ->whereNotIn('id', $answerIds)
                    ->delete();
            }
        }
    }
}
