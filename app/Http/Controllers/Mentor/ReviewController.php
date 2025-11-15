<?php

namespace App\Http\Controllers\Mentor;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReviewController extends Controller
{
    public function __construct()
    {
        $this->middleware('role:mentor');
    }

    /**
     * Display reviews for a specific course
     */
    public function index(Request $request, Kelas $kela)
    {
        // Verify ownership
        abort_if($kela->user_id !== auth()->id(), 403);

        $filter = $request->get('filter', 'all'); // all, published, unpublished
        $rating = $request->get('rating'); // 1-5
        $search = $request->get('search');

        $reviews = Review::with(['user:id,name,avatar'])
            ->where('kelas_id', $kela->id)
            ->when($filter === 'published', fn($q) => $q->published())
            ->when($filter === 'unpublished', fn($q) => $q->where('is_published', false))
            ->when($rating, fn($q) => $q->byRating((int) $rating))
            ->when($search, function ($query, $search) {
                $query->where('comment', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(15);

        // Rating distribution
        $ratingDistribution = [];
        for ($i = 5; $i >= 1; $i--) {
            $ratingDistribution[$i] = Review::where('kelas_id', $kela->id)
                ->published()
                ->where('rating', $i)
                ->count();
        }

        $stats = [
            'total' => Review::where('kelas_id', $kela->id)->count(),
            'published' => Review::where('kelas_id', $kela->id)->published()->count(),
            'unpublished' => Review::where('kelas_id', $kela->id)->where('is_published', false)->count(),
            'average_rating' => round(Review::where('kelas_id', $kela->id)->published()->avg('rating') ?? 0, 1),
            'rating_distribution' => $ratingDistribution,
        ];

        return Inertia::render('Mentor/Reviews/Index', [
            'kelas' => [
                'id' => $kela->id,
                'title' => $kela->title,
                'slug' => $kela->slug,
            ],
            'reviews' => $reviews,
            'stats' => $stats,
            'filters' => [
                'filter' => $filter,
                'rating' => $rating,
                'search' => $search,
            ],
        ]);
    }

    /**
     * Publish a review
     */
    public function publish(Kelas $kela, Review $review)
    {
        // Verify ownership
        abort_if($kela->user_id !== auth()->id(), 403);
        abort_if($review->kelas_id !== $kela->id, 404);

        $review->publish();

        return redirect()->back()->with('success', 'Review berhasil dipublikasikan.');
    }

    /**
     * Unpublish a review
     */
    public function unpublish(Kelas $kela, Review $review)
    {
        // Verify ownership
        abort_if($kela->user_id !== auth()->id(), 403);
        abort_if($review->kelas_id !== $kela->id, 404);

        $review->unpublish();

        return redirect()->back()->with('success', 'Review berhasil disembunyikan.');
    }

    /**
     * Delete a review
     */
    public function destroy(Kelas $kela, Review $review)
    {
        // Verify ownership
        abort_if($kela->user_id !== auth()->id(), 403);
        abort_if($review->kelas_id !== $kela->id, 404);

        $review->delete();

        return redirect()->back()->with('success', 'Review berhasil dihapus.');
    }
}
