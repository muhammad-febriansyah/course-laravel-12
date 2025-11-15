<?php

namespace App\Http\Controllers\Mentor;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Models\Kelas;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function __construct()
    {
        $this->middleware('role:mentor');
    }

    /**
     * Display students for a specific course
     */
    public function index(Request $request, Kelas $kela)
    {
        // Verify ownership
        abort_if($kela->user_id !== auth()->id(), 403);

        $search = $request->get('search');
        $sortBy = $request->get('sort_by', 'enrolled_at');
        $sortOrder = $request->get('sort_order', 'desc');

        $students = Enrollment::with(['user:id,name,email,avatar'])
            ->where('kelas_id', $kela->id)
            ->when($search, function ($query, $search) {
                $query->whereHas('user', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->orderBy($sortBy, $sortOrder)
            ->paginate(15)
            ->through(function ($enrollment) {
                return [
                    'id' => $enrollment->id,
                    'user' => $enrollment->user,
                    'status' => $enrollment->status,
                    'progress_percentage' => (float) $enrollment->progress_percentage,
                    'videos_completed' => $enrollment->videos_completed,
                    'quizzes_completed' => $enrollment->quizzes_completed,
                    'enrolled_at' => $enrollment->enrolled_at,
                    'last_accessed_at' => $enrollment->last_accessed_at,
                    'completed_at' => $enrollment->completed_at,
                ];
            });

        // Statistics
        $stats = [
            'total_students' => Enrollment::where('kelas_id', $kela->id)->count(),
            'active_students' => Enrollment::where('kelas_id', $kela->id)
                ->where('status', 'active')
                ->count(),
            'completed_students' => Enrollment::where('kelas_id', $kela->id)
                ->whereNotNull('completed_at')
                ->count(),
            'average_progress' => round(
                Enrollment::where('kelas_id', $kela->id)->avg('progress_percentage') ?? 0,
                2
            ),
        ];

        return Inertia::render('Mentor/Students/Index', [
            'kelas' => [
                'id' => $kela->id,
                'title' => $kela->title,
                'slug' => $kela->slug,
            ],
            'students' => $students,
            'stats' => $stats,
            'filters' => [
                'search' => $search,
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
            ],
        ]);
    }

    /**
     * Show detailed student progress
     */
    public function show(Kelas $kela, Enrollment $enrollment)
    {
        // Verify ownership
        abort_if($kela->user_id !== auth()->id(), 403);
        abort_if($enrollment->kelas_id !== $kela->id, 404);

        $enrollment->load([
            'user:id,name,email,avatar,phone',
            'kelas:id,title,slug',
        ]);

        // Get course structure with completion status
        $kela->load(['sections.videos', 'quizzes.quizAnswers']);

        return Inertia::render('Mentor/Students/Show', [
            'enrollment' => [
                'id' => $enrollment->id,
                'user' => $enrollment->user,
                'status' => $enrollment->status,
                'progress_percentage' => (float) $enrollment->progress_percentage,
                'videos_completed' => $enrollment->videos_completed,
                'quizzes_completed' => $enrollment->quizzes_completed,
                'enrolled_at' => $enrollment->enrolled_at,
                'last_accessed_at' => $enrollment->last_accessed_at,
                'completed_at' => $enrollment->completed_at,
            ],
            'kelas' => [
                'id' => $kela->id,
                'title' => $kela->title,
                'slug' => $kela->slug,
                'sections' => $kela->sections,
                'quizzes' => $kela->quizzes,
            ],
        ]);
    }
}
