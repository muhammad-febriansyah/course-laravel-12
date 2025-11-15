<?php

namespace App\Presentation\Http\Controllers\User;

use App\Application\Admin\Dashboard\AdminDashboardService;
use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Models\Transaction;
use App\Models\User;
use App\Presentation\Http\Resources\EnrollmentResource;
use App\Presentation\Http\Resources\TransactionResource;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        private readonly AdminDashboardService $adminDashboardService,
    ) {
    }

    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        if ($this->isAdmin($user)) {
            return $this->adminDashboard();
        }

        $enrollments = Enrollment::query()
            ->with(['kelas.category', 'kelas.level', 'kelas.user'])
            ->where('user_id', $user->id)
            ->latest('enrolled_at')
            ->limit(8)
            ->get()
            ->map(function (Enrollment $enrollment) {
                $enrollment->progress = $enrollment->status === 'completed'
                    ? 100
                    : ($enrollment->status === 'active' ? 35 : 0);

                return $enrollment;
            });

        $transactions = Transaction::query()
            ->with(['kelas'])
            ->where('user_id', $user->id)
            ->latest()
            ->limit(5)
            ->get();

        $stats = [
            'activeCourses' => $enrollments->where('status', 'active')->count(),
            'completedCourses' => $enrollments->where('status', 'completed')->count(),
            'totalTransactions' => Transaction::where('user_id', $user->id)->count(),
        ];

        return Inertia::render('dashboard', [
            'enrollments' => EnrollmentResource::collection($enrollments)->resolve(),
            'transactions' => TransactionResource::collection($transactions)->resolve(),
            'stats' => $stats,
        ]);
    }

    private function adminDashboard(): Response
    {
        $summary = $this->adminDashboardService->summary();
        $revenueTrend = $this->adminDashboardService->revenueTrend();
        $statusBreakdown = $this->adminDashboardService->transactionStatusBreakdown();
        $topCourses = $this->adminDashboardService->topCourses();
        $recentTransactions = $this->adminDashboardService->recentTransactions();
        $userBreakdown = $this->adminDashboardService->userBreakdown();

        return Inertia::render('Admin/Dashboard/Index', [
            'summary' => $summary,
            'revenueTrend' => $revenueTrend,
            'statusBreakdown' => $statusBreakdown,
            'topCourses' => $topCourses,
            'recentTransactions' => $recentTransactions,
            'userBreakdown' => $userBreakdown,
            'breadcrumbs' => [
                [
                    'title' => 'Dashboard',
                    'href' => route('dashboard'),
                ],
            ],
        ]);
    }

    private function isAdmin(?User $user): bool
    {
        if (!$user) {
            return false;
        }

        if (in_array($user->role, ['admin', 'superadmin'], true)) {
            return true;
        }

        return $user->email === 'admin@admin.com';
    }
}
