<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Discussion;
use App\Models\Enrollment;
use App\Models\Kelas;
use App\Services\ImageService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class DiscussionController extends Controller
{
    public function __construct(private readonly ImageService $imageService)
    {
    }

    public function index(Request $request, string $slug): Response
    {
        $user = $request->user();

        // Get the course
        $kelas = Kelas::query()
            ->where('slug', $slug)
            ->firstOrFail();

        // Check if user is enrolled
        $enrollment = Enrollment::query()
            ->where('user_id', $user->id)
            ->where('kelas_id', $kelas->id)
            ->where('status', 'active')
            ->firstOrFail();

        // Get discussions (only parent discussions, not replies)
        $discussions = Discussion::query()
            ->with(['user:id,name,avatar', 'replies'])
            ->where('kelas_id', $kelas->id)
            ->whereNull('parent_id')
            ->latest()
            ->get()
            ->map(function ($discussion) {
                return [
                    'id' => $discussion->id,
                    'title' => $discussion->title,
                    'content' => $discussion->content,
                    'image' => $discussion->image ? $this->imageService->url($discussion->image) : null,
                    'isResolved' => $discussion->is_resolved,
                    'createdAt' => $discussion->created_at->diffForHumans(),
                    'user' => [
                        'id' => $discussion->user->id,
                        'name' => $discussion->user->name,
                        'avatar' => $discussion->user->avatar ? $this->imageService->url($discussion->user->avatar) : null,
                    ],
                    'repliesCount' => $discussion->replies->count(),
                ];
            });

        return Inertia::render('user/learn/discussion', [
            'course' => [
                'id' => $kelas->id,
                'title' => $kelas->title,
                'slug' => $kelas->slug,
            ],
            'discussions' => $discussions,
        ]);
    }

    public function store(Request $request, string $slug): RedirectResponse
    {
        $user = $request->user();

        // Validate request
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,jpg,png,gif|max:2048',
        ]);

        // Get the course
        $kelas = Kelas::query()
            ->where('slug', $slug)
            ->firstOrFail();

        // Check if user is enrolled
        $enrollment = Enrollment::query()
            ->where('user_id', $user->id)
            ->where('kelas_id', $kelas->id)
            ->where('status', 'active')
            ->firstOrFail();

        // Handle image upload if exists
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('discussions', 'public');
        }

        // Create discussion
        Discussion::create([
            'kelas_id' => $kelas->id,
            'user_id' => $user->id,
            'title' => $validated['title'],
            'content' => $validated['content'],
            'image' => $imagePath,
        ]);

        return redirect()
            ->back()
            ->with('success', 'Diskusi berhasil dibuat!');
    }

    public function reply(Request $request, string $slug, Discussion $discussion): RedirectResponse
    {
        $user = $request->user();

        // Validate request
        $validated = $request->validate([
            'content' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,jpg,png,gif|max:2048',
        ]);

        // Get the course
        $kelas = Kelas::query()
            ->where('slug', $slug)
            ->firstOrFail();

        // Check if user is enrolled
        $enrollment = Enrollment::query()
            ->where('user_id', $user->id)
            ->where('kelas_id', $kelas->id)
            ->where('status', 'active')
            ->firstOrFail();

        // Handle image upload if exists
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('discussions', 'public');
        }

        // Create reply
        Discussion::create([
            'kelas_id' => $kelas->id,
            'user_id' => $user->id,
            'parent_id' => $discussion->id,
            'content' => $validated['content'],
            'image' => $imagePath,
        ]);

        return redirect()
            ->back()
            ->with('success', 'Balasan berhasil dikirim!');
    }
}
