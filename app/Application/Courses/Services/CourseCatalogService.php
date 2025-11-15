<?php

namespace App\Application\Courses\Services;

use App\Models\Category;
use App\Models\Kelas;
use App\Models\Level;
use App\Models\Type;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class CourseCatalogService
{
    public function getFeaturedCourses(int $limit = 6): Collection
    {
        return Kelas::query()
            ->with(['category', 'level', 'type', 'user'])
            ->where('status', Kelas::STATUS_APPROVED)
            ->orderByDesc('views')
            ->limit($limit)
            ->get();
    }

    public function getLatestCourses(int $limit = 8): Collection
    {
        return Kelas::query()
            ->with(['category', 'level', 'type', 'user'])
            ->where('status', Kelas::STATUS_APPROVED)
            ->latest()
            ->limit($limit)
            ->get();
    }

    public function paginateCourses(
        ?string $search = null,
        ?int $categoryId = null,
        ?int $levelId = null,
        ?int $typeId = null,
        int $perPage = 12,
    ): LengthAwarePaginator {
        return Kelas::query()
            ->with(['category', 'level', 'type', 'user'])
            ->where('status', Kelas::STATUS_APPROVED)
            ->when($search, function ($query, string $search) {
                $query->where(function ($qb) use ($search) {
                    $qb->where('title', 'like', "%{$search}%")
                        ->orWhere('desc', 'like', "%{$search}%");
                });
            })
            ->when($categoryId, fn ($query, $categoryId) => $query->where('category_id', $categoryId))
            ->when($levelId, fn ($query, $levelId) => $query->where('level_id', $levelId))
            ->when($typeId, fn ($query, $typeId) => $query->where('type_id', $typeId))
            ->paginate($perPage)
            ->withQueryString();
    }

    public function getCourseBySlug(string $slug): ?Kelas
    {
        return Kelas::query()
            ->with([
                'category',
                'level',
                'type',
                'user',
                'sections.videos',
                'quizzes.quizAnswers',
                'reviews' => fn ($query) => $query
                    ->published()
                    ->latest()
                    ->with('user'),
            ])
            ->where('slug', $slug)
            ->where('status', Kelas::STATUS_APPROVED)
            ->first();
    }

    public function getFilters(): array
    {
        return [
            'categories' => Category::query()
                ->orderBy('name')
                ->get(['id', 'name', 'slug'])
                ->map(fn (Category $category) => [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                ])
                ->all(),
            'levels' => Level::query()
                ->orderBy('name')
                ->get(['id', 'name'])
                ->map(fn (Level $level) => [
                    'id' => $level->id,
                    'name' => $level->name,
                ])
                ->all(),
            'types' => Type::query()
                ->orderBy('name')
                ->get(['id', 'name', 'slug'])
                ->map(fn (Type $type) => [
                    'id' => $type->id,
                    'name' => $type->name,
                    'slug' => $type->slug,
                ])
                ->all(),
        ];
    }
}
