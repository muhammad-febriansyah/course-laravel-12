<?php

namespace App\Presentation\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Presentation\Http\Resources\EnrollmentResource;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PurchasedCourseController extends Controller
{
    public function __construct(private readonly ImageService $imageService)
    {
    }

    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        $enrollments = Enrollment::query()
            ->with(['kelas.category', 'kelas.level', 'kelas.user'])
            ->where('user_id', $user->id)
            ->latest('enrolled_at')
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

        return Inertia::render('user/purchases/index', [
            'enrollments' => $enrollments,
        ]);
    }
}
