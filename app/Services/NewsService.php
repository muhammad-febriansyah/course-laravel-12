<?php

namespace App\Services;

use App\Models\News;
use App\Services\ImageService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class NewsService
{
    public function __construct(
        protected ImageService $imageService,
    ) {
    }

    public function list(): Collection
    {
        return News::with('category')
            ->latest()
            ->get()
            ->map(function (News $news) {
                $news->setAttribute('image', $this->imageService->url($news->image));

                return $news;
            });
    }

    public function create(array $data): News
    {
        if ($data['image'] instanceof UploadedFile) {
            $data['image'] = $this->imageService->store(
                $data['image'],
                'images/news',
                'news'
            );
        }

        $data['status'] = (int) ($data['status'] ?? 0);
        $data['slug'] = $this->prepareSlug($data['title']);

        return News::create([
            'category_id' => $data['category_id'],
            'title' => $data['title'],
            'slug' => $data['slug'],
            'desc' => $data['desc'],
            'body' => $data['body'],
            'image' => $data['image'],
            'status' => $data['status'],
            'views' => $data['views'] ?? 0,
        ]);
    }

    public function update(News $news, array $data): News
    {
        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
            $this->imageService->delete($news->image);

            $data['image'] = $this->imageService->store(
                $data['image'],
                'images/news',
                'news'
            );
        } else {
            unset($data['image']);
        }

        if (isset($data['status'])) {
            $data['status'] = (int) $data['status'];
        }

        $data['slug'] = $this->prepareSlug($data['title'], $news->id);

        $news->update($data);

        return $news->refresh()->load('category');
    }

    public function delete(News $news): void
    {
        $this->imageService->delete($news->image);

        $news->delete();
    }

    protected function prepareSlug(string $title, ?int $ignoreId = null): string
    {
        $baseSlug = Str::slug($title);
        $uniqueSlug = $baseSlug;
        $counter = 1;

        while (
            News::where('slug', $uniqueSlug)
                ->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $uniqueSlug = $baseSlug . '-' . $counter;
            $counter++;
        }

        return $uniqueSlug;
    }
}
