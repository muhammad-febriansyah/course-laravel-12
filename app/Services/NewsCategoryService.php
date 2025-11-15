<?php

namespace App\Services;

use App\Models\NewsCategory;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class NewsCategoryService
{
    public function __construct(
        protected FileUploadService $fileUploadService,
    ) {
    }

    public function list(): Collection
    {
        return NewsCategory::latest()->get();
    }

    public function create(array $data): NewsCategory
    {
        if ($data['image'] instanceof UploadedFile) {
            $data['image'] = $this->fileUploadService->uploadImage(
                $data['image'],
                'news-categories'
            );
        }

        $data['slug'] = $this->prepareSlug($data['name']);

        return NewsCategory::create([
            'name' => $data['name'],
            'slug' => $data['slug'],
            'image' => $data['image'],
        ]);
    }

    public function update(NewsCategory $category, array $data): NewsCategory
    {
        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
            $data['image'] = $this->fileUploadService->uploadImage(
                $data['image'],
                'news-categories',
                $category->image
            );
        } else {
            unset($data['image']);
        }

        $data['slug'] = $this->prepareSlug($data['name'], $category->id);

        $category->update($data);

        return $category->refresh();
    }

    public function delete(NewsCategory $category): void
    {
        if ($category->image) {
            $this->fileUploadService->deleteImage($category->image);
        }

        $category->delete();
    }

    protected function prepareSlug(string $name, ?int $ignoreId = null): string
    {
        $baseSlug = Str::slug($name);
        $uniqueSlug = $baseSlug;
        $counter = 1;

        while (
            NewsCategory::where('slug', $uniqueSlug)
                ->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $uniqueSlug = $baseSlug . '-' . $counter;
            $counter++;
        }

        return $uniqueSlug;
    }
}
