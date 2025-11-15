<?php

namespace App\Application\Admin\Dashboard;

use App\Models\Enrollment;
use App\Models\Kelas;
use App\Models\Transaction;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class AdminDashboardService
{
    public function summary(): array
    {
        $totalRevenue = (float) Transaction::where('status', 'paid')->sum('total');
        $paidTransactions = Transaction::where('status', 'paid')->count();

        return [
            'totalRevenue' => $totalRevenue,
            'activeStudents' => Enrollment::query()
                ->where('status', 'active')
                ->distinct('user_id')
                ->count('user_id'),
            'totalCourses' => Kelas::count(),
            'averageOrderValue' => $paidTransactions > 0 ? $totalRevenue / $paidTransactions : 0,
        ];
    }

    public function revenueTrend(int $months = 6): array
    {
        $start = Carbon::now()->subMonths($months - 1)->startOfMonth();

        $raw = Transaction::query()
            ->selectRaw('DATE_FORMAT(paid_at, "%Y-%m") as period, SUM(total) as total')
            ->where('status', 'paid')
            ->where('paid_at', '>=', $start)
            ->groupBy('period')
            ->orderBy('period')
            ->get();

        $result = [];
        $cursor = $start->copy();
        $end = Carbon::now()->startOfMonth();

        /** @var Collection<string, float> $lookup */
        $lookup = $raw->pluck('total', 'period');

        while ($cursor <= $end) {
            $periodKey = $cursor->format('Y-m');

            $result[] = [
                'label' => $cursor->format('M Y'),
                'value' => (float) ($lookup[$periodKey] ?? 0),
            ];

            $cursor->addMonth();
        }

        return $result;
    }

    public function transactionStatusBreakdown(): array
    {
        $statuses = ['paid', 'pending', 'expired', 'failed', 'refund'];

        $counts = Transaction::query()
            ->selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        return collect($statuses)
            ->map(fn (string $status) => [
                'status' => $status,
                'total' => (int) ($counts[$status] ?? 0),
            ])
            ->all();
    }

    public function topCourses(int $limit = 5): array
    {
        return Kelas::query()
            ->withCount(['enrollments as enrollments_count'])
            ->withSum(['transactions as revenue_sum' => function ($query) {
                $query->where('status', 'paid');
            }], 'total')
            ->orderByDesc('revenue_sum')
            ->limit($limit)
            ->get()
            ->map(fn (Kelas $course) => [
                'id' => $course->id,
                'title' => $course->title,
                'slug' => $course->slug,
                'enrollments' => (int) $course->enrollments_count,
                'revenue' => (float) ($course->revenue_sum ?? 0),
            ])
            ->all();
    }

    public function recentTransactions(int $limit = 8): array
    {
        return Transaction::query()
            ->with(['user', 'kelas'])
            ->latest()
            ->limit($limit)
            ->get()
            ->map(fn (Transaction $transaction) => [
                'id' => $transaction->id,
                'invoiceNumber' => $transaction->invoice_number,
                'status' => $transaction->status,
                'total' => (float) $transaction->total,
                'paymentMethod' => $transaction->payment_method,
                'paidAt' => optional($transaction->paid_at)->toDateTimeString(),
                'createdAt' => optional($transaction->created_at)->toDateTimeString(),
                'customer' => $transaction->user?->name,
                'course' => $transaction->kelas?->title,
            ])
            ->all();
    }

    public function userBreakdown(): array
    {
        return [
            'totalUsers' => User::count(),
            'instructors' => User::where('role', 'instructor')->count(),
            'students' => User::where(function ($query) {
                $query->whereNull('role')
                    ->orWhere('role', 'student');
            })->count(),
        ];
    }
}
