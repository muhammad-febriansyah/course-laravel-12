<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Models\Kelas;
use App\Models\QuizAttempt;
use App\Models\VideoProgress;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CertificateController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Get all active enrollments
        $enrollments = Enrollment::query()
            ->where('user_id', $user->id)
            ->where('status', 'active')
            ->with(['kelas' => function ($query) {
                $query->with(['sections.videos', 'user']);
            }])
            ->get();

        // Filter completed courses
        $completedCourses = $enrollments->filter(function ($enrollment) use ($user) {
            $kelas = $enrollment->kelas;

            // Count total videos
            $totalVideos = $kelas->sections->sum(function ($section) {
                return $section->videos->count();
            });

            // Count completed videos
            $completedVideos = VideoProgress::where('user_id', $user->id)
                ->where('enrollment_id', $enrollment->id)
                ->where('is_completed', true)
                ->count();

            // Check if has quiz attempts
            $hasQuizAttempts = QuizAttempt::where('user_id', $user->id)
                ->where('kelas_id', $kelas->id)
                ->exists();

            // Course is complete if all videos watched AND at least 1 quiz attempt
            $isCompleted = $completedVideos >= $totalVideos && $hasQuizAttempts;

            // Generate certificate code if course is completed and doesn't have one yet
            if ($isCompleted && !$enrollment->certificate_code) {
                $enrollment->update([
                    'certificate_code' => $this->generateCertificateCode(),
                    'certificate_issued_at' => now(),
                    'completed_at' => $enrollment->completed_at ?? now(),
                ]);
                $enrollment->refresh();
            }

            return $isCompleted;
        })->map(function ($enrollment) use ($user) {
            $kelas = $enrollment->kelas;

            // Get best quiz score
            $bestQuizAttempt = QuizAttempt::where('user_id', $user->id)
                ->where('kelas_id', $kelas->id)
                ->orderBy('score', 'desc')
                ->first();

            return [
                'id' => $kelas->id,
                'title' => $kelas->title,
                'slug' => $kelas->slug,
                'thumbnail' => $kelas->image,
                'instructor' => [
                    'name' => $kelas->user->name,
                ],
                'completed_at' => $enrollment->updated_at->format('d M Y'),
                'certificate_code' => $enrollment->certificate_code,
                'certificate_issued_at' => $enrollment->certificate_issued_at ? $enrollment->certificate_issued_at->format('d M Y') : null,
                'quiz_score' => $bestQuizAttempt ? $bestQuizAttempt->score : 0,
                'quiz_total' => $bestQuizAttempt ? $bestQuizAttempt->total_questions * 10 : 0, // Assuming 10 points per question
            ];
        })->values();

        return Inertia::render('user/certificates/index', [
            'completedCourses' => $completedCourses,
        ]);
    }

    public function download(Request $request, string $slug)
    {
        $user = $request->user();

        // Get the course
        $kelas = Kelas::where('slug', $slug)
            ->with(['sections.videos', 'user'])
            ->firstOrFail();

        // Get enrollment
        $enrollment = Enrollment::where('user_id', $user->id)
            ->where('kelas_id', $kelas->id)
            ->where('status', 'active')
            ->firstOrFail();

        // Verify course completion
        $totalVideos = $kelas->sections->sum(function ($section) {
            return $section->videos->count();
        });

        $completedVideos = VideoProgress::where('user_id', $user->id)
            ->where('enrollment_id', $enrollment->id)
            ->where('is_completed', true)
            ->count();

        $hasQuizAttempts = QuizAttempt::where('user_id', $user->id)
            ->where('kelas_id', $kelas->id)
            ->exists();

        if ($completedVideos < $totalVideos || !$hasQuizAttempts) {
            return redirect()
                ->route('user.certificates.index')
                ->with('error', 'Anda belum menyelesaikan kelas ini!');
        }

        // Get best quiz score
        $bestQuizAttempt = QuizAttempt::where('user_id', $user->id)
            ->where('kelas_id', $kelas->id)
            ->orderBy('score', 'desc')
            ->first();

        // TODO: Generate PDF certificate
        // For now, return a simple response
        return response()->json([
            'message' => 'Certificate download feature coming soon!',
            'course' => $kelas->title,
            'user' => $user->name,
            'certificate_code' => $enrollment->certificate_code,
            'score' => $bestQuizAttempt->score,
            'completed_at' => $enrollment->updated_at->format('d F Y'),
        ]);
    }

    /**
     * Generate unique certificate code
     */
    private function generateCertificateCode(): string
    {
        do {
            // Format: SKILLUP-YYYY-XXXX (e.g., SKILLUP-2024-A1B2)
            $year = date('Y');
            $random = strtoupper(Str::random(4));
            $code = "SKILLUP-{$year}-{$random}";
        } while (Enrollment::where('certificate_code', $code)->exists());

        return $code;
    }
}
