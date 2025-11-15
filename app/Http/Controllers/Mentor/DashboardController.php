<?php

namespace App\Http\Controllers\Mentor;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // Get mentor's own courses
        $totalCourses = Kelas::where('user_id', $user->id)->count();
        $publishedCourses = Kelas::where('user_id', $user->id)
            ->where('status', 1)
            ->count();
        $draftCourses = Kelas::where('user_id', $user->id)
            ->where('status', 0)
            ->count();

        // Get total views for mentor's courses
        $totalViews = Kelas::where('user_id', $user->id)->sum('views');

        // Get total students across all courses
        $totalStudents = \App\Models\Enrollment::whereHas('kelas', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->count();

        // Get unresolved discussions count
        $unresolvedDiscussions = \App\Models\Discussion::whereHas('kelas', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->questions()->unresolved()->count();

        // Get average rating across all courses
        $averageRating = \App\Models\Review::whereHas('kelas', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->published()->avg('rating') ?? 0;

        // Recent courses
        $recentCourses = Kelas::where('user_id', $user->id)
            ->with(['category', 'type', 'level'])
            ->withCount('enrollments')
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Mentor/Dashboard/Index', [
            'stats' => [
                'totalCourses' => $totalCourses,
                'publishedCourses' => $publishedCourses,
                'draftCourses' => $draftCourses,
                'totalViews' => $totalViews,
                'totalStudents' => $totalStudents,
                'unresolvedDiscussions' => $unresolvedDiscussions,
                'averageRating' => round($averageRating, 1),
            ],
            'recentCourses' => $recentCourses,
        ]);
    }
}
