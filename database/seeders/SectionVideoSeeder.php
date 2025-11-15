<?php

namespace Database\Seeders;

use App\Models\Kelas;
use App\Models\Section;
use App\Models\Video;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class SectionVideoSeeder extends Seeder
{
    /**
     * Daftar judul section yang akan digunakan secara berulang.
     *
     * @var array<int, string>
     */
    protected array $sectionTopics = [
        'Pendahuluan & Overview',
        'Dasar-Dasar Konsep',
        'Studi Kasus Utama',
        'Praktik Implementasi',
        'Optimasi dan Tips',
        'Automasi & Workflow',
        'Analisis & Evaluasi',
        'Kolaborasi & Sharing',
        'Penutup & Next Step',
        'Bonus Resources',
    ];

    /**
     * Daftar tema video untuk memberi variasi judul.
     *
     * @var array<int, string>
     */
    protected array $videoTopics = [
        'Konsep',
        'Demo',
        'Studi Kasus',
        'Hands-on',
        'Refactor',
        'Analisa',
        'Benchmark',
        'Checklist',
        'Insight',
        'Latihan',
    ];

    public function run(): void
    {
        $kelasList = Kelas::query()->with('sections')->get();

        if ($kelasList->isEmpty()) {
            $this->command?->warn('SectionVideoSeeder: belum ada data kelas, jalankan KelasSeeder terlebih dahulu.');
            return;
        }

        foreach ($kelasList as $kelas) {
            foreach (range(1, 10) as $index) {
                $sectionTitle = sprintf(
                    'Section %02d - %s',
                    $index,
                    Arr::get($this->sectionTopics, $index - 1, 'Materi Tambahan')
                );

                $section = Section::firstOrCreate(
                    [
                        'kelas_id' => $kelas->id,
                        'title' => $sectionTitle,
                    ],
                    [
                        'kelas_id' => $kelas->id,
                        'title' => $sectionTitle,
                    ]
                );

                foreach (range(1, 10) as $videoIndex) {
                    $videoTitle = sprintf(
                        'K%02d Section %02d - %s %02d',
                        $kelas->id,
                        $index,
                        Arr::get($this->videoTopics, $videoIndex - 1, 'Materi'),
                        $videoIndex
                    );

                    $video = Video::where('section_id', $section->id)
                        ->where('title', $videoTitle)
                        ->first();

                    if ($video) {
                        $video->update([
                            'video' => $this->dummyYoutubeUrl($kelas->id, $index, $videoIndex),
                        ]);
                        continue;
                    }

                    $slugBase = Str::slug($videoTitle);
                    $slug = $slugBase;
                    $counter = 1;

                    while (Video::where('slug', $slug)->exists()) {
                        $slug = "{$slugBase}-{$counter}";
                        $counter++;
                    }

                    Video::create([
                        'section_id' => $section->id,
                        'title' => $videoTitle,
                        'video' => $this->dummyYoutubeUrl($kelas->id, $index, $videoIndex),
                        'slug' => $slug,
                    ]);
                }
            }
        }
    }

    private function dummyYoutubeUrl(int $kelasId, int $sectionIndex, int $videoIndex): string
    {
        return sprintf(
            'https://youtu.be/dQw4w9WgXcQ?course=%d&section=%d&video=%d',
            $kelasId,
            $sectionIndex,
            $videoIndex
        );
    }
}
