<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Services\FileUploadService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function __construct(
        private readonly FileUploadService $fileUploadService
    ) {
    }
    public function index()
    {
        $categories = Category::latest()->get();

        return Inertia::render('categories/index', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'required|file|mimes:jpeg,png,jpg,svg|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $this->fileUploadService->uploadImage(
                $request->file('image'),
                'categories'
            );
        }

        Category::create($validated);

        return back()->with('success', 'Kategori berhasil ditambahkan.');
    }

    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'nullable|file|mimes:jpeg,png,jpg,svg|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $this->fileUploadService->uploadImage(
                $request->file('image'),
                'categories',
                $category->image
            );
        } else {
            unset($validated['image']);
        }

        $category->update($validated);

        return back()->with('success', 'Kategori berhasil diperbarui.');
    }

    public function destroy(Category $category)
    {
        $this->fileUploadService->delete($category->image);

        $category->delete();

        return back()->with('success', 'Kategori berhasil dihapus.');
    }
}
