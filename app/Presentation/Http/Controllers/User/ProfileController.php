<?php

namespace App\Presentation\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Models\Transaction;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function __construct(private readonly ImageService $imageService)
    {
    }

    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        $enrollmentCount = Enrollment::where('user_id', $user->id)->count();
        $completedCount = Enrollment::where('user_id', $user->id)
            ->where('status', 'completed')
            ->count();
        $totalSpent = Transaction::where('user_id', $user->id)
            ->whereIn('status', ['paid', 'PAID', 'success', 'SUCCESS'])
            ->sum('total');

        $profile = [
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'address' => $user->address,
            'avatar' => $this->imageService->url($user->avatar),
            'joinedAt' => optional($user->created_at)->toDateTimeString(),
        ];

        return Inertia::render('user/profile/index', [
            'profile' => $profile,
            'stats' => [
                'enrollmentCount' => $enrollmentCount,
                'completedCount' => $completedCount,
                'totalSpent' => (float) $totalSpent,
            ],
        ]);
    }
}
