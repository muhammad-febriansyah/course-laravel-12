<?php

namespace App\Http\Controllers;

use App\Http\Requests\News\StoreNewsRequest;
use App\Http\Requests\News\UpdateNewsRequest;
use App\Models\News;
use App\Models\NewsCategory;
use App\Services\ImageService;
use App\Services\NewsService;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class NewsController extends Controller
{
    public function __construct(
        protected NewsService $newsService,
        protected ImageService $imageService,
    ) {}

    public function index()
    {
        return Inertia::render('news/index', [
            'posts' => $this->newsService->list(),
            'categories' => NewsCategory::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function show(News $news)
    {
        $news->load('category');
        $news->setAttribute('image', $this->imageService->url($news->image));

        return Inertia::render('news/show', [
            'post' => $news,
        ]);
    }

    public function store(StoreNewsRequest $request)
    {
        $data = $request->validated();
        $data['image'] = $request->file('image');

        // Debug: Check if image file exists
        Log::info('News Store - Image file:', [
            'has_file' => $request->hasFile('image'),
            'file' => $request->file('image')?->getClientOriginalName(),
            'validated_data' => array_keys($data),
        ]);

        $this->newsService->create($data);

        return back()->with('success', 'Artikel blog berhasil ditambahkan.');
    }

    public function update(UpdateNewsRequest $request, News $news)
    {
        $data = $request->validated();

        $data = array_merge(
            $news->only(['category_id', 'title', 'desc', 'body', 'status']),
            $data,
        );

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image');
        }

        $this->newsService->update($news, $data);

        return back()->with('success', 'Artikel blog berhasil diperbarui.');
    }

    public function destroy(News $news)
    {
        $this->newsService->delete($news);

        return back()->with('success', 'Artikel blog berhasil dihapus.');
    }
}
