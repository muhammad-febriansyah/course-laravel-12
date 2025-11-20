<?php

namespace App\Presentation\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Models\Kelas;
use App\Models\VideoProgress;
use App\Services\ImageService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CourseLearnController extends Controller
{
    public function __construct(private readonly ImageService $imageService)
    {
    }

    public function show(Request $request, string $slug): Response|RedirectResponse
    {
        $user = $request->user();

        $autoPlayVideoId = (int) $request->session()->get('autoPlayVideoId', 0) ?: null;

        // Get the course
        $kelas = Kelas::query()
            ->with([
                'sections.videos',
                'category',
                'level',
                'user'
            ])
            ->where('slug', $slug)
            ->firstOrFail();

        // Check if user is enrolled and active
        $enrollment = Enrollment::query()
            ->where('user_id', $user->id)
            ->where('kelas_id', $kelas->id)
            ->where('status', 'active')
            ->first();

        if (!$enrollment) {
            return redirect()
                ->route('courses.show', $slug)
                ->with('error', 'Anda belum membeli kelas ini atau enrollment Anda tidak aktif!');
        }

        // Update last accessed timestamp
        $enrollment->update([
            'last_accessed_at' => now(),
        ]);

        // Transform course data
        $courseData = [
            'id' => $kelas->id,
            'title' => $kelas->title,
            'slug' => $kelas->slug,
            'description' => $kelas->desc,
            'image' => $this->imageService->url($kelas->image),
            'category' => $kelas->category ? [
                'id' => $kelas->category->id,
                'name' => $kelas->category->name,
            ] : null,
            'level' => $kelas->level ? [
                'id' => $kelas->level->id,
                'name' => $kelas->level->name,
            ] : null,
            'mentor' => $kelas->user ? [
                'id' => $kelas->user->id,
                'name' => $kelas->user->name,
            ] : null,
        ];

        // Get user's video progress
        $videoProgress = VideoProgress::where('user_id', $user->id)
            ->where('enrollment_id', $enrollment->id)
            ->get()
            ->keyBy('video_id');

        // Transform sections and videos
        $selectedInitialVideo = null;

        $sections = $kelas->sections->map(function ($section) use ($videoProgress, $autoPlayVideoId, &$selectedInitialVideo) {
            return [
                'id' => $section->id,
                'title' => $section->title,
                'videos' => $section->videos->map(function ($video) use ($videoProgress, $autoPlayVideoId, &$selectedInitialVideo) {
                    $progress = $videoProgress->get($video->id);
                    $transformed = [
                        'id' => $video->id,
                        'title' => $video->title,
                        'slug' => $video->slug,
                        'video' => $video->video,
                        'embedUrl' => $video->embed_url,
                        'isCompleted' => $progress ? $progress->is_completed : false,
                        'watchDuration' => $progress ? $progress->watch_duration : 0,
                        'lastWatchedAt' => $progress ? $progress->last_watched_at?->toISOString() : null,
                    ];

                    // Determine initial selected video:
                    // - Prefer the one set via autoPlayVideoId (next video after marking complete)
                    // - Fallback to the very first video in the course
                    if ($autoPlayVideoId && $video->id === $autoPlayVideoId) {
                        $selectedInitialVideo = $transformed;
                    } elseif ($selectedInitialVideo === null) {
                        $selectedInitialVideo = $transformed;
                    }

                    return $transformed;
                })->values(),
            ];
        })->values();

        // Use selectedInitialVideo if available
        $firstVideo = $selectedInitialVideo;

        return Inertia::render('user/learn/course', [
            'course' => $courseData,
            'sections' => $sections,
            'enrollment' => [
                'id' => $enrollment->id,
                'progress' => $enrollment->progress_percentage,
                'videosCompleted' => $enrollment->videos_completed,
                'quizzesCompleted' => $enrollment->quizzes_completed,
                'status' => $enrollment->status,
            ],
            'firstVideo' => $firstVideo,
        ]);
    }
}
