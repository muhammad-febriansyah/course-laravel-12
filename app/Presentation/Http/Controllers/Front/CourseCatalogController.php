<?php

namespace App\Presentation\Http\Controllers\Front;

use App\Application\Courses\Services\CourseCatalogService;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Setting;
use App\Models\Enrollment;
use App\Presentation\Http\Resources\CourseResource;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CourseCatalogController extends Controller
{
    public function __construct(
        private readonly CourseCatalogService $catalogService,
        private readonly ImageService $imageService,
    ) {
    }

    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'category', 'level', 'type']);

        $categoryId = null;
        if (isset($filters['category']) && $filters['category'] !== '') {
            $rawCategory = (string) $filters['category'];

            if (ctype_digit($rawCategory)) {
                $categoryId = (int) $rawCategory;
            } else {
                $categoryId = Category::query()
                    ->where('slug', $rawCategory)
                    ->value('id');
            }
        }

        $courses = $this->catalogService->paginateCourses(
            search: $filters['search'] ?? null,
            categoryId: $categoryId,
            levelId: isset($filters['level']) && $filters['level'] !== ''
                ? (int) $filters['level']
                : null,
            typeId: isset($filters['type']) && $filters['type'] !== ''
                ? (int) $filters['type']
                : null,
            perPage: 12,
        );

        $collection = CourseResource::collection($courses->getCollection())
            ->resolve();

        $collection = collect($collection)
            ->map(fn (array $course) => $this->transformCourse($course))
            ->values()
            ->all();

        $meta = [
            'currentPage' => $courses->currentPage(),
            'lastPage' => $courses->lastPage(),
            'perPage' => $courses->perPage(),
            'total' => $courses->total(),
        ];

        return Inertia::render('front/courses/index', [
            'settings' => $this->prepareSettings(),
            'courses' => $collection,
            'meta' => $meta,
            'filters' => $filters,
            'options' => $this->catalogService->getFilters(),
        ]);
    }

    public function show(string $slug): Response
    {
        $course = $this->catalogService->getCourseBySlug($slug);

        abort_unless($course, 404);

        $user = request()->user();
        $isEnrolled = false;

        if ($user) {
            $isEnrolled = Enrollment::query()
                ->where('kelas_id', $course->id)
                ->where('user_id', $user->id)
                ->exists();
        }

        $resource = CourseResource::make($course)
            ->resolve();
        $resource = $this->transformCourse($resource);
        $resource['isEnrolled'] = $isEnrolled;
        $resource['previewLimit'] = 3;

        $related = $this->catalogService->getFeaturedCourses(limit: 4)
            ->reject(fn ($item) => $item->id === $course->id)
            ->take(3);

        $relatedCollection = CourseResource::collection($related)
            ->resolve();

        $relatedCollection = collect($relatedCollection)
            ->map(fn (array $item) => $this->transformCourse($item))
            ->values()
            ->all();

        return Inertia::render('front/courses/show', [
            'settings' => $this->prepareSettings(),
            'course' => $resource,
            'relatedCourses' => $relatedCollection,
        ]);
    }

    /**
     * Normalize course payload for the front-end.
     *
     * @param  array<string, mixed>  $course
     * @return array<string, mixed>
     */
    protected function transformCourse(array $course): array
    {
        $course['image'] = $this->imageService->url($course['image'] ?? null);

        if (isset($course['instructor']['avatar'])) {
            $course['instructor']['avatar'] = $this->imageService->url(
                $course['instructor']['avatar'],
            );
        }

        $course['benefits'] = collect($course['benefits'] ?? [])
            ->filter(fn ($benefit) => filled($benefit))
            ->values()
            ->all();

        $course['sections'] = collect($course['sections'] ?? [])
            ->map(function ($section) {
                $videos = collect($section['videos'] ?? [])
                    ->map(function ($video) {
                        return [
                            'id' => isset($video['id']) ? (int) $video['id'] : null,
                            'title' => $video['title'] ?? '',
                            'slug' => $video['slug'] ?? '',
                            'url' => $video['url'] ?? '',
                            'embedUrl' => $video['embedUrl'] ?? null,
                        ];
                    })
                    ->values()
                    ->all();

                return [
                    'id' => $section['id'] ?? null,
                    'title' => $section['title'] ?? '',
                    'videos' => $videos,
                ];
            })
            ->values()
            ->all();

        $course['reviews'] = collect($course['reviews'] ?? [])
            ->map(function ($review) {
                if (isset($review['user']['avatar'])) {
                    $review['user']['avatar'] = $this->imageService->url(
                        $review['user']['avatar'],
                    );
                }

                return $review;
            })
            ->values()
            ->all();

        return $course;
    }

    protected function prepareSettings(): ?array
    {
        $settings = Setting::first();

        if (! $settings) {
            return null;
        }

        $data = $settings->toArray();

        foreach (['logo', 'favicon', 'thumbnail', 'home_thumbnail'] as $field) {
            $data[$field] = $this->imageService->url($settings->$field);
        }

        return $data;
    }
}
