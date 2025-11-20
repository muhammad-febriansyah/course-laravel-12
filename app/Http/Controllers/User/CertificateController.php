<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Models\Kelas;
use App\Models\QuizAttempt;
use App\Models\VideoProgress;
use App\Services\ImageService;
use App\Services\CertificateGeneratorService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CertificateController extends Controller
{
    public function __construct(
        private readonly ImageService $imageService,
        private readonly CertificateGeneratorService $certificateGeneratorService,
    ) {
    }

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
                'thumbnail' => $this->imageService->url($kelas->image),
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

        // Ensure certificate code exists
        if (!$enrollment->certificate_code) {
            $enrollment->update([
                'certificate_code' => $this->generateCertificateCode(),
                'certificate_issued_at' => now(),
                'completed_at' => $enrollment->completed_at ?? now(),
            ]);
            $enrollment->refresh();
        }

        // Get best quiz score
        $bestQuizAttempt = QuizAttempt::where('user_id', $user->id)
            ->where('kelas_id', $kelas->id)
            ->orderBy('score', 'desc')
            ->first();

        // Use the latest active certificate template
        $template = \App\Models\CertificateTemplate::latest()->first();

        if (! $template) {
            return redirect()
                ->route('user.certificates.index')
                ->with('error', 'Template sertifikat belum dikonfigurasi oleh admin.');
        }

        $data = [
            'recipient_name' => $user->name,
            'course_name' => $kelas->title,
            'issue_date' => ($enrollment->certificate_issued_at ?? now())->format('d F Y'),
            'certificate_id' => $enrollment->certificate_code,
            'signature_name' => $kelas->user?->name ?? config('app.name', 'Skill UP'),
        ];

        try {
            $relativePath = $this->certificateGeneratorService->generate($template, $data);
        } catch (\Throwable $e) {
            \Log::error('Certificate generation failed for enrollment', [
                'enrollment_id' => $enrollment->id,
                'user_id' => $user->id,
                'kelas_id' => $kelas->id,
                'error' => $e->getMessage(),
            ]);

            return redirect()
                ->route('user.certificates.index')
                ->with('error', 'Gagal menghasilkan sertifikat. Silakan coba beberapa saat lagi.');
        }

        // $relativePath is relative to storage/app/public (e.g., certificates/generated/cert_xxx.pdf)
        $fullPath = storage_path('app/public/' . $relativePath);

        if (! file_exists($fullPath)) {
            return redirect()
                ->route('user.certificates.index')
                ->with('error', 'File sertifikat tidak ditemukan.');
        }

        // Stream the generated PDF file to the browser
        return response()->file($fullPath, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename=\"certificate-' . $kelas->slug . '.pdf\"',
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
