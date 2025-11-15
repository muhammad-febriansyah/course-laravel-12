<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Kelas;
use App\Models\Level;
use App\Models\Type;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class KelasController extends Controller
{
    public function __construct()
    {
        $this->middleware('role:admin');
    }

    public function index()
    {
        $kelas = Kelas::with(['category:id,name', 'type:id,name', 'level:id,name', 'user:id,name'])
            ->latest()
            ->get();

        return Inertia::render('kelas/index', [
            'kelas' => $kelas,
            'categories' => Category::select('id', 'name')->get(),
            'types' => Type::select('id', 'name')->get(),
            'levels' => Level::select('id', 'name')->get(),
            'canManage' => false,
            'isMentor' => false,
            'canReview' => true,
            'basePath' => '/admin/kelas',
        ]);
    }

    public function show(Kelas $kelas)
    {
        $kelas->load([
            'category:id,name',
            'type:id,name',
            'level:id,name',
            'user:id,name,email',
            'sections.videos',
            'quizzes.quizAnswers',
        ]);

        $normalizeStatus = function ($status) {
            if (\is_string($status) && in_array($status, [
                Kelas::STATUS_DRAFT,
                Kelas::STATUS_PENDING,
                Kelas::STATUS_APPROVED,
                Kelas::STATUS_REJECTED,
            ], true)) {
                return $status;
            }

            $map = [0 => Kelas::STATUS_DRAFT, 1 => Kelas::STATUS_PENDING, 2 => Kelas::STATUS_APPROVED, 3 => Kelas::STATUS_REJECTED];
            return $map[(int) $status] ?? Kelas::STATUS_DRAFT;
        };

        $payload = [
            'id' => $kelas->id,
            'title' => $kelas->title,
            'slug' => $kelas->slug,
            'price' => (float) ($kelas->price ?? 0),
            'discount' => (float) ($kelas->discount ?? 0),
            'status' => $normalizeStatus($kelas->status),
            'views' => (int) ($kelas->views ?? 0),
            'benefit' => $kelas->benefit,
            'desc' => $kelas->desc,
            'body' => $kelas->body,
            'image' => $kelas->image,
            'category' => $kelas->category ? ['id' => $kelas->category->id, 'name' => $kelas->category->name] : null,
            'type' => $kelas->type ? ['id' => $kelas->type->id, 'name' => $kelas->type->name] : null,
            'level' => $kelas->level ? ['id' => $kelas->level->id, 'name' => $kelas->level->name] : null,
            'user' => $kelas->user ? ['id' => $kelas->user->id, 'name' => $kelas->user->name, 'email' => $kelas->user->email] : null,
            'sections' => $kelas->sections->map(function ($section) {
                return [
                    'id' => $section->id,
                    'title' => $section->title,
                    'videos' => $section->videos->map(function ($video) {
                        return [
                            'id' => $video->id,
                            'title' => $video->title,
                            'slug' => $video->slug,
                            'video' => $video->embed_url ?: $video->video,
                            'embed_url' => $video->embed_url,
                        ];
                    })->values(),
                ];
            })->values(),
            'quizzes' => $kelas->quizzes->map(function ($quiz) {
                return [
                    'id' => $quiz->id,
                    'question' => $quiz->question,
                    'answer' => $quiz->answer,
                    'image' => $quiz->image,
                    'point' => $quiz->point,
                ];
            })->values(),
            'created_at' => optional($kelas->created_at)->toISOString(),
        ];

        return Inertia::render('kelas/show', [
            'kelas' => $payload,
            'canManage' => false,
            'canReview' => true,
            'basePath' => '/admin/kelas',
        ]);
    }

    public function approve(Kelas $kelas)
    {
        $kelas->update([
            'status' => Kelas::STATUS_APPROVED,
            'approved_at' => now(),
            'rejected_at' => null,
            'rejected_reason' => null,
        ]);

        return back()->with('success', 'Kelas berhasil disetujui.');
    }

    public function reject(Request $request, Kelas $kelas)
    {
        $request->validate([
            'reason' => ['nullable', 'string', 'max:1000'],
        ]);

        $kelas->update([
            'status' => Kelas::STATUS_REJECTED,
            'rejected_at' => now(),
            'rejected_reason' => $request->input('reason'),
        ]);

        return back()->with('success', 'Kelas berhasil ditolak.');
    }
}
