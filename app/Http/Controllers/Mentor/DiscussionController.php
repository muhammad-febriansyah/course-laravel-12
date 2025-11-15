<?php

namespace App\Http\Controllers\Mentor;

use App\Http\Controllers\Controller;
use App\Models\Discussion;
use App\Models\Kelas;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class DiscussionController extends Controller
{
    public function __construct()
    {
        $this->middleware('role:mentor');
    }

    /**
     * Display discussions for a specific course
     */
    public function index(Request $request, Kelas $kela)
    {
        // Verify ownership
        abort_if($kela->user_id !== auth()->id(), 403);

        $filter = $request->get('filter', 'all'); // all, unresolved, resolved
        $search = $request->get('search');

        $discussions = Discussion::with(['user:id,name,avatar', 'replies'])
            ->where('kelas_id', $kela->id)
            ->questions() // Only main questions, not replies
            ->when($filter === 'unresolved', fn($q) => $q->unresolved())
            ->when($filter === 'resolved', fn($q) => $q->resolved())
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                        ->orWhere('content', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(15);

        $stats = [
            'total' => Discussion::where('kelas_id', $kela->id)->questions()->count(),
            'unresolved' => Discussion::where('kelas_id', $kela->id)->questions()->unresolved()->count(),
            'resolved' => Discussion::where('kelas_id', $kela->id)->questions()->resolved()->count(),
        ];

        return Inertia::render('Mentor/Discussions/Index', [
            'kelas' => [
                'id' => $kela->id,
                'title' => $kela->title,
                'slug' => $kela->slug,
            ],
            'discussions' => $discussions,
            'stats' => $stats,
            'filters' => [
                'filter' => $filter,
                'search' => $search,
            ],
        ]);
    }

    /**
     * Display a single discussion with replies
     */
    public function show(Kelas $kela, Discussion $discussion)
    {
        // Verify ownership
        abort_if($kela->user_id !== auth()->id(), 403);
        abort_if($discussion->kelas_id !== $kela->id, 404);

        $discussion->load([
            'user:id,name,email,avatar',
            'replies.user:id,name,avatar',
            'resolvedBy:id,name',
        ]);

        return Inertia::render('Mentor/Discussions/Show', [
            'kelas' => [
                'id' => $kela->id,
                'title' => $kela->title,
                'slug' => $kela->slug,
            ],
            'discussion' => $discussion,
        ]);
    }

    /**
     * Reply to a discussion
     */
    public function reply(Request $request, Kelas $kela, Discussion $discussion)
    {
        // Verify ownership
        abort_if($kela->user_id !== auth()->id(), 403);
        abort_if($discussion->kelas_id !== $kela->id, 404);

        $validated = $request->validate([
            'content' => ['required', 'string', 'max:5000'],
        ]);

        Discussion::create([
            'kelas_id' => $kela->id,
            'user_id' => auth()->id(),
            'parent_id' => $discussion->id,
            'content' => $validated['content'],
        ]);

        return redirect()->back()->with('success', 'Balasan berhasil dikirim.');
    }

    /**
     * Mark discussion as resolved
     */
    public function resolve(Kelas $kela, Discussion $discussion)
    {
        // Verify ownership
        abort_if($kela->user_id !== auth()->id(), 403);
        abort_if($discussion->kelas_id !== $kela->id, 404);

        $discussion->markAsResolved(auth()->user());

        return redirect()->back()->with('success', 'Diskusi ditandai sebagai selesai.');
    }

    /**
     * Mark discussion as unresolved
     */
    public function unresolve(Kelas $kela, Discussion $discussion)
    {
        // Verify ownership
        abort_if($kela->user_id !== auth()->id(), 403);
        abort_if($discussion->kelas_id !== $kela->id, 404);

        $discussion->markAsUnresolved();

        return redirect()->back()->with('success', 'Diskusi ditandai sebagai belum selesai.');
    }

    /**
     * Delete a discussion (only if mentor created it or it's a reply to their course)
     */
    public function destroy(Kelas $kela, Discussion $discussion)
    {
        // Verify ownership
        abort_if($kela->user_id !== auth()->id(), 403);
        abort_if($discussion->kelas_id !== $kela->id, 404);

        $discussion->delete();

        return redirect()->back()->with('success', 'Diskusi berhasil dihapus.');
    }
}
