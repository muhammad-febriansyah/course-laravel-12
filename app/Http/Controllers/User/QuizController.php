<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Models\Kelas;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Models\UserAnswer;
use App\Models\VideoProgress;
use App\Services\ImageService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class QuizController extends Controller
{
    public function __construct(private readonly ImageService $imageService)
    {
    }

    public function index(Request $request, string $slug): Response|RedirectResponse
    {
        $user = $request->user();

        // Get the course
        $kelas = Kelas::query()
            ->with(['quizzes.quizAnswers'])
            ->where('slug', $slug)
            ->firstOrFail();

        // Check if user is enrolled
        $enrollment = Enrollment::query()
            ->where('user_id', $user->id)
            ->where('kelas_id', $kelas->id)
            ->where('status', 'active')
            ->firstOrFail();

        // Check if all videos are completed
        $totalVideos = \App\Models\Video::whereHas('section', function ($query) use ($kelas) {
            $query->where('kelas_id', $kelas->id);
        })->count();

        $completedVideos = VideoProgress::where('user_id', $user->id)
            ->where('enrollment_id', $enrollment->id)
            ->where('is_completed', true)
            ->count();

        if ($completedVideos < $totalVideos) {
            return redirect()
                ->route('user.learn.course', $slug)
                ->with('error', 'Anda harus menyelesaikan semua video terlebih dahulu sebelum mengerjakan quiz!');
        }

        // Get user's quiz attempts
        $attempts = QuizAttempt::where('user_id', $user->id)
            ->where('kelas_id', $kelas->id)
            ->orderBy('attempt_number')
            ->get();

        $currentAttempt = $attempts->count() + 1;

        // Check if user has reached max attempts (3)
        if ($attempts->count() >= 3) {
            $latestAttempt = $attempts->last();
            return Inertia::render('user/learn/quiz-result', [
                'course' => [
                    'id' => $kelas->id,
                    'title' => $kelas->title,
                    'slug' => $kelas->slug,
                ],
                'attempt' => [
                    'attempt_number' => $latestAttempt->attempt_number,
                    'score' => $latestAttempt->score,
                    'total_questions' => $latestAttempt->total_questions,
                    'completed_at' => $latestAttempt->completed_at?->format('d M Y H:i'),
                ],
                'maxAttemptsReached' => true,
                'allAttempts' => $attempts->map(function ($attempt) {
                    return [
                        'attempt_number' => $attempt->attempt_number,
                        'score' => $attempt->score,
                        'total_questions' => $attempt->total_questions,
                        'completed_at' => $attempt->completed_at?->format('d M Y H:i'),
                    ];
                }),
            ]);
        }

        // Transform quiz data
        $quizzes = $kelas->quizzes->map(function ($quiz) {
            return [
                'id' => $quiz->id,
                'question' => $quiz->question,
                'image' => $quiz->image ? $this->imageService->url($quiz->image) : null,
                'point' => $quiz->point,
                'answers' => $quiz->quizAnswers->map(function ($answer) {
                    return [
                        'id' => $answer->id,
                        'answer' => $answer->answer,
                        'point' => $answer->point,
                    ];
                })->shuffle()->values(),
            ];
        });

        return Inertia::render('user/learn/quiz', [
            'course' => [
                'id' => $kelas->id,
                'title' => $kelas->title,
                'slug' => $kelas->slug,
            ],
            'quizzes' => $quizzes,
            'currentAttempt' => $currentAttempt,
            'remainingAttempts' => 3 - $attempts->count(),
            'previousAttempts' => $attempts->map(function ($attempt) {
                return [
                    'attempt_number' => $attempt->attempt_number,
                    'score' => $attempt->score,
                    'total_questions' => $attempt->total_questions,
                    'completed_at' => $attempt->completed_at?->format('d M Y H:i'),
                ];
            }),
        ]);
    }

    public function submit(Request $request, string $slug): RedirectResponse
    {
        $user = $request->user();

        // Validate
        $validated = $request->validate([
            'answers' => 'required|array',
            'answers.*.quiz_id' => 'required|exists:quizzes,id',
            'answers.*.answer_id' => 'required|exists:quiz_answers,id',
        ]);

        // Get the course
        $kelas = Kelas::query()
            ->where('slug', $slug)
            ->firstOrFail();

        // Get enrollment
        $enrollment = Enrollment::query()
            ->where('user_id', $user->id)
            ->where('kelas_id', $kelas->id)
            ->where('status', 'active')
            ->firstOrFail();

        // Get current attempt number
        $attemptCount = QuizAttempt::where('user_id', $user->id)
            ->where('kelas_id', $kelas->id)
            ->count();

        if ($attemptCount >= 3) {
            return redirect()
                ->back()
                ->with('error', 'Anda sudah mencapai batas maksimal 3x percobaan!');
        }

        $currentAttemptNumber = $attemptCount + 1;

        // Create quiz attempt
        $quizAttempt = QuizAttempt::create([
            'user_id' => $user->id,
            'kelas_id' => $kelas->id,
            'enrollment_id' => $enrollment->id,
            'attempt_number' => $currentAttemptNumber,
            'total_questions' => count($validated['answers']),
            'completed_at' => now(),
        ]);

        // Calculate score and save answers
        $totalScore = 0;
        foreach ($validated['answers'] as $answer) {
            $quizAnswer = \App\Models\QuizAnswer::find($answer['answer_id']);

            UserAnswer::create([
                'user_id' => $user->id,
                'kelas_id' => $kelas->id,
                'quiz_attempt_id' => $quizAttempt->id,
                'quiz_id' => $answer['quiz_id'],
                'quiz_answer_id' => $answer['answer_id'],
                'point' => $quizAnswer->point,
                'edit_count' => 0,
            ]);

            $totalScore += $quizAnswer->point;
        }

        // Update attempt score
        $quizAttempt->update(['score' => $totalScore]);

        return redirect()
            ->route('user.quiz.result', $slug)
            ->with('success', 'Quiz berhasil diselesaikan!');
    }

    public function result(Request $request, string $slug): Response
    {
        $user = $request->user();

        // Get the course
        $kelas = Kelas::query()
            ->where('slug', $slug)
            ->firstOrFail();

        // Get latest attempt
        $latestAttempt = QuizAttempt::where('user_id', $user->id)
            ->where('kelas_id', $kelas->id)
            ->latest('attempt_number')
            ->firstOrFail();

        // Get all attempts
        $allAttempts = QuizAttempt::where('user_id', $user->id)
            ->where('kelas_id', $kelas->id)
            ->orderBy('attempt_number')
            ->get();

        $canRetake = $allAttempts->count() < 3;

        return Inertia::render('user/learn/quiz-result', [
            'course' => [
                'id' => $kelas->id,
                'title' => $kelas->title,
                'slug' => $kelas->slug,
            ],
            'attempt' => [
                'attempt_number' => $latestAttempt->attempt_number,
                'score' => $latestAttempt->score,
                'total_questions' => $latestAttempt->total_questions,
                'completed_at' => $latestAttempt->completed_at?->format('d M Y H:i'),
            ],
            'canRetake' => $canRetake,
            'remainingAttempts' => 3 - $allAttempts->count(),
            'allAttempts' => $allAttempts->map(function ($attempt) {
                return [
                    'attempt_number' => $attempt->attempt_number,
                    'score' => $attempt->score,
                    'total_questions' => $attempt->total_questions,
                    'completed_at' => $attempt->completed_at?->format('d M Y H:i'),
                ];
            }),
        ]);
    }
}
