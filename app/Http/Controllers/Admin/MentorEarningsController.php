<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class MentorEarningsController extends Controller
{
    public function index(Request $request)
    {
        // Get all mentors with their earnings
        $mentors = User::where('role', 'mentor')
            ->with(['kelas' => function ($query) {
                $query->withCount([
                    'transactions as total_sales' => fn ($q) => $q->paid(),
                ])
                ->withSum([
                    'transactions as total_revenue' => fn ($q) => $q->paid(),
                ], 'total')
                ->withSum([
                    'transactions as mentor_earnings' => fn ($q) => $q->paid(),
                ], 'mentor_earnings')
                ->withSum([
                    'transactions as platform_fees' => fn ($q) => $q->paid(),
                ], 'platform_fee');
            }])
            ->get()
            ->map(function ($mentor) {
                $totalSales = $mentor->kelas->sum('total_sales') ?? 0;
                $totalRevenue = $mentor->kelas->sum('total_revenue') ?? 0;
                $mentorEarnings = $mentor->kelas->sum('mentor_earnings') ?? 0;
                $platformFees = $mentor->kelas->sum('platform_fees') ?? 0;

                return [
                    'id' => $mentor->id,
                    'name' => $mentor->name,
                    'email' => $mentor->email,
                    'total_courses' => $mentor->kelas->count(),
                    'total_sales' => (int) $totalSales,
                    'total_revenue' => (float) $totalRevenue,
                    'mentor_earnings' => (float) $mentorEarnings,
                    'platform_fees' => (float) $platformFees,
                ];
            })
            ->sortByDesc('total_revenue')
            ->values();

        // Calculate totals
        $summary = [
            'total_mentors' => $mentors->count(),
            'total_sales' => $mentors->sum('total_sales'),
            'total_revenue' => $mentors->sum('total_revenue'),
            'total_mentor_earnings' => $mentors->sum('mentor_earnings'),
            'total_platform_fees' => $mentors->sum('platform_fees'),
        ];

        return Inertia::render('Admin/mentor-earnings/index', [
            'mentors' => $mentors,
            'summary' => $summary,
        ]);
    }

    public function show(User $mentor)
    {
        // Get detailed transactions for a specific mentor
        $transactions = Transaction::whereHas('kelas', function ($query) use ($mentor) {
            $query->where('user_id', $mentor->id);
        })
        ->with(['kelas:id,title', 'user:id,name'])
        ->where('status', 'paid')
        ->latest()
        ->paginate(20);

        $summary = Transaction::whereHas('kelas', function ($query) use ($mentor) {
            $query->where('user_id', $mentor->id);
        })
        ->where('status', 'paid')
        ->select([
            DB::raw('COUNT(*) as total_transactions'),
            DB::raw('SUM(total) as total_revenue'),
            DB::raw('SUM(mentor_earnings) as total_mentor_earnings'),
            DB::raw('SUM(platform_fee) as total_platform_fees'),
        ])
        ->first();

        return Inertia::render('Admin/mentor-earnings/show', [
            'mentor' => [
                'id' => $mentor->id,
                'name' => $mentor->name,
                'email' => $mentor->email,
            ],
            'transactions' => $transactions,
            'summary' => [
                'total_transactions' => $summary->total_transactions ?? 0,
                'total_revenue' => (float) ($summary->total_revenue ?? 0),
                'total_mentor_earnings' => (float) ($summary->total_mentor_earnings ?? 0),
                'total_platform_fees' => (float) ($summary->total_platform_fees ?? 0),
            ],
        ]);
    }

    public function exportPdf()
    {
        // Get all mentors with their earnings
        $mentors = User::where('role', 'mentor')
            ->with(['kelas' => function ($query) {
                $query->withCount([
                    'transactions as total_sales' => fn ($q) => $q->paid(),
                ])
                ->withSum([
                    'transactions as total_revenue' => fn ($q) => $q->paid(),
                ], 'total')
                ->withSum([
                    'transactions as mentor_earnings' => fn ($q) => $q->paid(),
                ], 'mentor_earnings')
                ->withSum([
                    'transactions as platform_fees' => fn ($q) => $q->paid(),
                ], 'platform_fee');
            }])
            ->get()
            ->map(function ($mentor) {
                $totalSales = $mentor->kelas->sum('total_sales') ?? 0;
                $totalRevenue = $mentor->kelas->sum('total_revenue') ?? 0;
                $mentorEarnings = $mentor->kelas->sum('mentor_earnings') ?? 0;
                $platformFees = $mentor->kelas->sum('platform_fees') ?? 0;

                return [
                    'id' => $mentor->id,
                    'name' => $mentor->name,
                    'email' => $mentor->email,
                    'total_courses' => $mentor->kelas->count(),
                    'total_sales' => (int) $totalSales,
                    'total_revenue' => (float) $totalRevenue,
                    'mentor_earnings' => (float) $mentorEarnings,
                    'platform_fees' => (float) $platformFees,
                ];
            })
            ->sortByDesc('total_revenue')
            ->values();

        // Calculate totals
        $summary = [
            'total_mentors' => $mentors->count(),
            'total_sales' => $mentors->sum('total_sales'),
            'total_revenue' => $mentors->sum('total_revenue'),
            'total_mentor_earnings' => $mentors->sum('mentor_earnings'),
            'total_platform_fees' => $mentors->sum('platform_fees'),
        ];

        $pdf = Pdf::loadView('pdf.mentor-earnings', [
            'mentors' => $mentors,
            'summary' => $summary,
            'generated_at' => now()->format('d F Y H:i'),
        ]);

        return $pdf->download('laporan-pendapatan-mentor-' . date('Y-m-d') . '.pdf');
    }

    public function exportMentorPdf(User $mentor)
    {
        // Get detailed transactions for a specific mentor
        $transactions = Transaction::whereHas('kelas', function ($query) use ($mentor) {
            $query->where('user_id', $mentor->id);
        })
        ->with(['kelas:id,title', 'user:id,name'])
        ->where('status', 'paid')
        ->latest()
        ->get();

        $summary = Transaction::whereHas('kelas', function ($query) use ($mentor) {
            $query->where('user_id', $mentor->id);
        })
        ->where('status', 'paid')
        ->select([
            DB::raw('COUNT(*) as total_transactions'),
            DB::raw('SUM(total) as total_revenue'),
            DB::raw('SUM(mentor_earnings) as total_mentor_earnings'),
            DB::raw('SUM(platform_fee) as total_platform_fees'),
        ])
        ->first();

        $pdf = Pdf::loadView('pdf.mentor-earnings-detail', [
            'mentor' => $mentor,
            'transactions' => $transactions,
            'summary' => [
                'total_transactions' => $summary->total_transactions ?? 0,
                'total_revenue' => (float) ($summary->total_revenue ?? 0),
                'total_mentor_earnings' => (float) ($summary->total_mentor_earnings ?? 0),
                'total_platform_fees' => (float) ($summary->total_platform_fees ?? 0),
            ],
            'generated_at' => now()->format('d F Y H:i'),
        ]);

        return $pdf->download('laporan-' . \Str::slug($mentor->name) . '-' . date('Y-m-d') . '.pdf');
    }
}
