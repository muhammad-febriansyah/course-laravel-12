<?php

namespace App\Presentation\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Models\Video;
use App\Models\VideoProgress;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class VideoProgressController extends Controller
{
    public function markAsComplete(Request $request, Video $video): RedirectResponse
    {
        $user = $request->user();

        // Load section relation to get kelas_id
        $video->load('section');

        // Validate that user has access to this video through enrollment
        $enrollment = Enrollment::query()
            ->where('user_id', $user->id)
            ->where('kelas_id', $video->section->kelas_id)
            ->where('status', 'active')
            ->firstOrFail();

        // Create or update video progress
        VideoProgress::updateOrCreate(
            [
                'user_id' => $user->id,
                'video_id' => $video->id,
            ],
            [
                'enrollment_id' => $enrollment->id,
                'is_completed' => true,
                'last_watched_at' => now(),
                'completed_at' => now(),
            ]
        );

        // Update enrollment statistics
        $this->updateEnrollmentStats($enrollment);

        // Find next video
        $nextVideo = $this->findNextVideo($video);

        \Log::info('Mark Complete - Current Video:', ['id' => $video->id, 'title' => $video->title]);
        \Log::info('Mark Complete - Next Video:', ['id' => $nextVideo?->id, 'title' => $nextVideo?->title]);

        // If there's a next video, redirect to same page with next video ID in query param
        if ($nextVideo) {
            return redirect()->back()->with([
                'success' => 'Video berhasil ditandai selesai!',
                'autoPlayVideoId' => $nextVideo->id,
            ]);
        }

        return back()->with([
            'success' => 'Video berhasil ditandai selesai! Ini adalah video terakhir.',
        ]);
    }

    public function updateWatchTime(Request $request, Video $video): RedirectResponse
    {
        $validated = $request->validate([
            'watch_duration' => 'required|integer|min:0',
        ]);

        $user = $request->user();

        // Load section relation to get kelas_id
        $video->load('section');

        // Validate that user has access to this video through enrollment
        $enrollment = Enrollment::query()
            ->where('user_id', $user->id)
            ->where('kelas_id', $video->section->kelas_id)
            ->where('status', 'active')
            ->firstOrFail();

        // Update video progress
        VideoProgress::updateOrCreate(
            [
                'user_id' => $user->id,
                'video_id' => $video->id,
            ],
            [
                'enrollment_id' => $enrollment->id,
                'watch_duration' => $validated['watch_duration'],
                'last_watched_at' => now(),
            ]
        );

        return back();
    }

    private function updateEnrollmentStats(Enrollment $enrollment): void
    {
        // Count total videos through sections
        $totalVideos = Video::whereHas('section', function ($query) use ($enrollment) {
            $query->where('kelas_id', $enrollment->kelas_id);
        })->count();

        $completedVideos = VideoProgress::where('enrollment_id', $enrollment->id)
            ->where('is_completed', true)
            ->count();

        $progressPercentage = $totalVideos > 0
            ? round(($completedVideos / $totalVideos) * 100, 2)
            : 0;

        $enrollment->update([
            'videos_completed' => $completedVideos,
            'progress_percentage' => $progressPercentage,
            'last_accessed_at' => now(),
        ]);
    }

    private function findNextVideo(Video $currentVideo): ?Video
    {
        $currentVideo->load('section.kelas.sections.videos');

        $allSections = $currentVideo->section->kelas->sections()
            ->with('videos')
            ->orderBy('id')
            ->get();

        $currentSectionIndex = null;
        $currentVideoIndex = null;

        // Find current video position
        foreach ($allSections as $sectionIndex => $section) {
            foreach ($section->videos as $videoIndex => $video) {
                if ($video->id === $currentVideo->id) {
                    $currentSectionIndex = $sectionIndex;
                    $currentVideoIndex = $videoIndex;
                    break 2;
                }
            }
        }

        if ($currentSectionIndex === null || $currentVideoIndex === null) {
            return null;
        }

        $currentSection = $allSections[$currentSectionIndex];

        // Check if there's next video in current section
        if ($currentVideoIndex + 1 < $currentSection->videos->count()) {
            return $currentSection->videos[$currentVideoIndex + 1];
        }

        // Check if there's next section
        if ($currentSectionIndex + 1 < $allSections->count()) {
            $nextSection = $allSections[$currentSectionIndex + 1];
            return $nextSection->videos->first();
        }

        // No next video
        return null;
    }
}
