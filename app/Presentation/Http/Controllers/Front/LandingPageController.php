<?php

namespace App\Presentation\Http\Controllers\Front;

use App\Application\Courses\Services\CourseCatalogService;
use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Models\Kelas;
use App\Models\User;
use App\Presentation\Http\Resources\CourseResource;
use Inertia\Inertia;
use Inertia\Response;

class LandingPageController extends Controller
{
    public function __construct(
        private readonly CourseCatalogService $catalogService,
    ) {
    }

    public function __invoke(): Response
    {
        $featured = $this->catalogService->getFeaturedCourses();
        $latest = $this->catalogService->getLatestCourses();

        return Inertia::render('front/home/landing', [
            'featuredCourses' => CourseResource::collection($featured)->resolve(),
            'latestCourses' => CourseResource::collection($latest)->resolve(),
            'stats' => [
                'totalCourses' => Kelas::where('status', 1)->count(),
                'totalStudents' => Enrollment::count(),
                'totalInstructors' => User::where('role', 'instructor')->count(),
            ],
        ]);
    }
}
