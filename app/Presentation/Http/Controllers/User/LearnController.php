<?php

namespace App\Presentation\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Presentation\Http\Resources\EnrollmentResource;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LearnController extends Controller
{
    public function __construct(private readonly ImageService $imageService)
    {
    }

    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        // Get active enrollments with course details
        $enrollments = Enrollment::query()
            ->with(['kelas.category', 'kelas.level', 'kelas.user'])
            ->where('user_id', $user->id)
            ->where('status', 'active')
            ->latest('last_accessed_at')
            ->get();

        $enrollments = EnrollmentResource::collection($enrollments)
            ->resolve();

        $imageService = $this->imageService;
        $enrollments = array_map(static function (array $enrollment) use ($imageService) {
            if (isset($enrollment['course']['image'])) {
                $enrollment['course']['image'] = $imageService->url(
                    $enrollment['course']['image'],
                );
            }

            return $enrollment;
        }, $enrollments);

        // Get recently accessed course
        $recentCourse = !empty($enrollments) ? $enrollments[0] : null;

        return Inertia::render('user/learn/index', [
            'enrollments' => $enrollments,
            'recentCourse' => $recentCourse,
        ]);
    }
}
