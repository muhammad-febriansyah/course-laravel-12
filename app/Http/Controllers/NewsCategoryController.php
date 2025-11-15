<?php

namespace App\Http\Controllers;

use App\Http\Requests\NewsCategory\StoreNewsCategoryRequest;
use App\Http\Requests\NewsCategory\UpdateNewsCategoryRequest;
use App\Models\NewsCategory;
use App\Services\NewsCategoryService;
use Inertia\Inertia;

class NewsCategoryController extends Controller
{
    public function __construct(
        protected NewsCategoryService $newsCategoryService,
    ) {}

    public function index()
    {
        return Inertia::render('news/categories/index', [
            'categories' => $this->newsCategoryService->list(),
        ]);
    }

    public function store(StoreNewsCategoryRequest $request)
    {
        $data = $request->validated();
        $data['image'] = $request->file('image');

        $this->newsCategoryService->create($data);

        return back()->with('success', 'Kategori blog berhasil ditambahkan.');
    }

    public function update(UpdateNewsCategoryRequest $request, NewsCategory $newsCategory)
    {
        $data = $request->validated();

        $data = array_merge(
            $newsCategory->only(['name']),
            $data,
        );

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image');
        }

        $this->newsCategoryService->update($newsCategory, $data);

        return back()->with('success', 'Kategori blog berhasil diperbarui.');
    }

    public function destroy(NewsCategory $newsCategory)
    {
        $this->newsCategoryService->delete($newsCategory);
        return back()->with('success', 'Kategori blog berhasil dihapus.');
    }
}
