<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Faq;
use App\Models\Feature;
use App\Models\Kelas;
use App\Models\Menu;
use App\Models\News;
use App\Models\NewsCategory;
use App\Models\Setting;
use App\Models\KebijakanPrivasi;
use App\Models\TermCondition;
use App\Services\ImageService;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function __construct(
        protected ImageService $imageService,
    ) {}

    public function index()
    {
        $features = Feature::where('is_active', true)
            ->orderBy('order')
            ->get();

        $menus = Menu::active()
            ->parent()
            ->with(['children' => function ($query) {
                $query->active()->orderBy('order');
            }])
            ->orderBy('order')
            ->get();

        // Get published reviews
        $reviews = \App\Models\Review::with(['user', 'kelas'])
            ->where('is_published', true)
            ->latest()
            ->limit(20)
            ->get()
            ->map(function ($review) {
                return [
                    'id' => $review->id,
                    'name' => $review->user->name,
                    'rating' => $review->rating,
                    'comment' => $review->comment,
                    'kelas_title' => $review->kelas->title,
                    'avatar' => $review->user->avatar ?? 'https://ui-avatars.com/api/?name=' . urlencode($review->user->name) . '&background=2547F9&color=fff',
                ];
            });

        // Get statistics from settings (editable in admin panel)
        $settings_data = $this->prepareSettings();
        $stats = [
            [
                'value' => $settings_data['stats_students_value'] ?? '10,000+',
                'label' => $settings_data['stats_students_label'] ?? 'Siswa Aktif',
                'description' => $settings_data['stats_students_desc'] ?? 'Bergabung dengan kami',
            ],
            [
                'value' => $settings_data['stats_courses_value'] ?? '500+',
                'label' => $settings_data['stats_courses_label'] ?? 'Kursus Premium',
                'description' => $settings_data['stats_courses_desc'] ?? 'Tersedia untuk dipelajari',
            ],
            [
                'value' => $settings_data['stats_instructors_value'] ?? '100+',
                'label' => $settings_data['stats_instructors_label'] ?? 'Instruktur Expert',
                'description' => $settings_data['stats_instructors_desc'] ?? 'Siap membimbing Anda',
            ],
            [
                'value' => $settings_data['stats_satisfaction_value'] ?? '95%',
                'label' => $settings_data['stats_satisfaction_label'] ?? 'Tingkat Kepuasan',
                'description' => $settings_data['stats_satisfaction_desc'] ?? 'Dari student kami',
            ],
        ];

        $popularCourses = Kelas::with([
            'category:id,name,slug',
            'user:id,name,avatar',
        ])
            ->where('status', Kelas::STATUS_APPROVED)
            ->withCount('enrollments')
            ->orderByDesc('enrollments_count')
            ->orderByDesc('views')
            ->limit(4)
            ->get()
            ->map(function (Kelas $kelas) {
                $benefits = $kelas->benefit;

                if (is_string($benefits)) {
                    $decodedBenefits = json_decode($benefits, true);
                    if (json_last_error() === JSON_ERROR_NONE && is_array($decodedBenefits)) {
                        $benefits = $decodedBenefits;
                    } else {
                        $benefits = array_filter(array_map('trim', preg_split("/\r\n|\n|\r/", $benefits)));
                    }
                }

                if (!is_array($benefits)) {
                    $benefits = [];
                }

                return [
                    'id' => $kelas->id,
                    'title' => $kelas->title,
                    'slug' => $kelas->slug,
                    'price' => (float) $kelas->price,
                    'discount' => (float) $kelas->discount,
                    'finalPrice' => (float) max($kelas->price - $kelas->discount, 0),
                    'image' => $this->imageService->url($kelas->image),
                    'shortDescription' => Str::limit(strip_tags($kelas->desc ?? ''), 110),
                    'benefits' => $benefits,
                    'category' => $kelas->category ? [
                        'id' => $kelas->category->id,
                        'name' => $kelas->category->name,
                        'slug' => $kelas->category->slug,
                    ] : null,
                    'instructor' => $kelas->user ? [
                        'id' => $kelas->user->id,
                        'name' => $kelas->user->name,
                        'avatar' => $kelas->user->avatar,
                    ] : null,
                    'views' => (int) ($kelas->views ?? 0),
                ];
            })
            ->values()
            ->all();

        $recentNews = News::with('category:id,name,slug')
            ->where('status', true)
            ->latest()
            ->limit(3)
            ->get()
            ->map(function (News $newsItem) {
                return [
                    'id' => $newsItem->id,
                    'title' => $newsItem->title,
                    'slug' => $newsItem->slug,
                    'desc' => Str::limit(strip_tags($newsItem->desc ?? ''), 100),
                    'image' => $this->imageService->url($newsItem->image),
                    'published_at' => optional($newsItem->created_at)->toIsoString(),
                    'category' => $newsItem->category ? [
                        'id' => $newsItem->category->id,
                        'name' => $newsItem->category->name,
                        'slug' => $newsItem->category->slug,
                    ] : null,
                ];
            })
            ->all();

        $faqsPreview = Faq::select('id', 'question', 'answer')
            ->latest()
            ->limit(4)
            ->get()
            ->map(fn (Faq $faq) => [
                'id' => $faq->id,
                'question' => $faq->question,
                'answer' => $faq->answer,
            ])
            ->all();

        $categoriesHighlight = Category::select('id', 'name', 'slug', 'image')
            ->get()
            ->map(function (Category $category) {
                $coursesCount = Kelas::where('status', Kelas::STATUS_APPROVED)
                    ->where('category_id', $category->id)
                    ->count();

                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'image' => $category->image_url,
                    'courses_count' => $coursesCount,
                ];
            })
            ->sortByDesc('courses_count')
            ->values()
            ->take(6)
            ->all();

        return Inertia::render('front/home/index', [
            'settings' => $settings_data,
            'features' => $features,
            'menus' => $menus,
            'reviews' => $reviews,
            'stats' => $stats,
            'popularCourses' => $popularCourses,
            'recentNews' => $recentNews,
            'faqs' => $faqsPreview,
            'categoriesHighlight' => $categoriesHighlight,
        ]);
    }

    public function lainnya()
    {
        return Inertia::render('front/lainnya/index', [
            'settings' => $this->prepareSettings(),
        ]);
    }

    public function blog(Request $request)
    {
        $search = trim((string) $request->query('search', ''));
        $categoryValue = $request->query('category');
        if ($categoryValue === 'all') {
            $categoryValue = null;
        }
        $perPage = 6;

        $categories = NewsCategory::orderBy('name')->get(['id', 'name', 'slug']);
        $selectedCategory = null;

        if ($categoryValue) {
            $selectedCategory = $categories->first(function (NewsCategory $category) use ($categoryValue) {
                return $category->slug === $categoryValue || (string) $category->id === $categoryValue;
            });
        }

        $newsQuery = News::with(['category:id,name,slug'])
            ->where('status', true)
            ->latest();

        if ($selectedCategory) {
            $newsQuery->where('category_id', $selectedCategory->id);
        }

        if ($search !== '') {
            $newsQuery->where(function ($query) use ($search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('desc', 'like', "%{$search}%")
                    ->orWhere('body', 'like', "%{$search}%");
            });
        }

        $newsPaginated = $newsQuery
            ->paginate($perPage)
            ->withQueryString();

        $newsData = $newsPaginated->through(function (News $newsItem) {
            return [
                'id' => $newsItem->id,
                'title' => $newsItem->title,
                'slug' => $newsItem->slug,
                'desc' => $newsItem->desc,
                'image' => $this->imageService->url($newsItem->image),
                'published_at' => optional($newsItem->created_at)->toISOString(),
                'category' => $newsItem->category ? [
                    'id' => $newsItem->category->id,
                    'name' => $newsItem->category->name,
                    'slug' => $newsItem->category->slug,
                ] : null,
            ];
        })->items();

        $newsFormatted = [
            'data' => $newsData,
            'meta' => [
                'current_page' => $newsPaginated->currentPage(),
                'last_page' => $newsPaginated->lastPage(),
                'per_page' => $newsPaginated->perPage(),
                'total' => $newsPaginated->total(),
                'from' => $newsPaginated->firstItem(),
                'to' => $newsPaginated->lastItem(),
            ],
        ];

        $categoryOptions = $categories->map(function (NewsCategory $category) {
            return [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'value' => $category->slug ?? (string) $category->id,
            ];
        });

        return Inertia::render('front/blog/index', [
            'settings' => $this->prepareSettings(),
            'news' => $newsFormatted,
            'categories' => $categoryOptions,
            'filters' => [
                'search' => $search !== '' ? $search : null,
                'category' => $selectedCategory
                    ? ($selectedCategory->slug ?? (string) $selectedCategory->id)
                    : (is_string($categoryValue) ? $categoryValue : null),
            ],
        ]);
    }

    public function blogShow(string $slug)
    {
        $news = News::with(['category:id,name,slug'])
            ->where('status', true)
            ->where('slug', $slug)
            ->firstOrFail();

        $news->increment('views');
        $news->refresh()->load('category');

        $post = [
            'id' => $news->id,
            'title' => $news->title,
            'slug' => $news->slug,
            'desc' => $news->desc,
            'body' => $news->body,
            'image' => $this->imageService->url($news->image),
            'published_at' => optional($news->created_at)->toISOString(),
            'views' => $news->views,
            'category' => $news->category ? [
                'id' => $news->category->id,
                'name' => $news->category->name,
                'slug' => $news->category->slug,
            ] : null,
        ];

        $related = News::with(['category:id,name,slug'])
            ->where('status', true)
            ->where('id', '!=', $news->id)
            ->when($news->category_id, function ($query) use ($news) {
                $query->where('category_id', $news->category_id);
            })
            ->latest()
            ->limit(3)
            ->get()
            ->map(function (News $newsItem) {
                return [
                    'id' => $newsItem->id,
                    'title' => $newsItem->title,
                    'slug' => $newsItem->slug,
                    'desc' => $newsItem->desc,
                    'image' => $this->imageService->url($newsItem->image),
                    'published_at' => optional($newsItem->created_at)->toISOString(),
                    'category' => $newsItem->category ? [
                        'id' => $newsItem->category->id,
                        'name' => $newsItem->category->name,
                        'slug' => $newsItem->category->slug,
                    ] : null,
                ];
            });

        return Inertia::render('front/blog/show', [
            'settings' => $this->prepareSettings(),
            'post' => $post,
            'related' => $related,
        ]);
    }

    public function register()
    {
        return Inertia::render('front/auth/register/index', [
            'settings' => $this->prepareSettings(),
        ]);
    }

    public function kelas(Request $request)
    {
        $search = trim((string) $request->query('search', ''));
        $perPage = 9;

        $kelasQuery = Kelas::with([
            'category:id,name,slug',
            'user:id,name,avatar',
        ])->where('status', Kelas::STATUS_APPROVED);

        if ($search !== '') {
            $kelasQuery->where(function ($query) use ($search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('desc', 'like', "%{$search}%")
                    ->orWhere('body', 'like', "%{$search}%");
            });
        }

        $paginated = $kelasQuery
            ->latest()
            ->paginate($perPage)
            ->withQueryString();

        $courses = collect($paginated->items())->map(function (Kelas $kelas) {
            $benefits = $kelas->benefit;

            if (is_string($benefits)) {
                $decodedBenefits = json_decode($benefits, true);
                if (json_last_error() === JSON_ERROR_NONE && is_array($decodedBenefits)) {
                    $benefits = $decodedBenefits;
                } else {
                    $benefits = array_filter(array_map('trim', preg_split("/\r\n|\n|\r/", $benefits)));
                }
            }

            if (!is_array($benefits)) {
                $benefits = [];
            }

            return [
                'id' => $kelas->id,
                'title' => $kelas->title,
                'slug' => $kelas->slug,
                'price' => (float) $kelas->price,
                'discount' => (float) $kelas->discount,
                'finalPrice' => (float) max($kelas->price - $kelas->discount, 0),
                'image' => $this->imageService->url($kelas->image),
                'shortDescription' => Str::limit(strip_tags($kelas->desc ?? ''), 110),
                'benefits' => $benefits,
                'category' => $kelas->category ? [
                    'id' => $kelas->category->id,
                    'name' => $kelas->category->name,
                    'slug' => $kelas->category->slug,
                ] : null,
                'instructor' => $kelas->user ? [
                    'id' => $kelas->user->id,
                    'name' => $kelas->user->name,
                    'avatar' => $kelas->user->avatar,
                ] : null,
                'views' => (int) ($kelas->views ?? 0),
            ];
        })->values()->all();

        $paginationMeta = [
            'current_page' => $paginated->currentPage(),
            'last_page' => $paginated->lastPage(),
            'per_page' => $paginated->perPage(),
            'total' => $paginated->total(),
            'from' => $paginated->firstItem(),
            'to' => $paginated->lastItem(),
        ];

        return Inertia::render('front/kelas/index', [
            'settings' => $this->prepareSettings(),
            'courses' => [
                'data' => $courses,
                'meta' => $paginationMeta,
            ],
            'filters' => [
                'search' => $search !== '' ? $search : null,
            ],
        ]);
    }

    public function contactUs()
    {
        return Inertia::render('front/contact-us/index', [
            'settings' => $this->prepareSettings(),
        ]);
    }

    public function tentangKami()
    {
        return Inertia::render('front/tentang-kami/index', [
            'settings' => $this->prepareSettings(),
        ]);
    }

    public function syaratKetentuan()
    {
        $term = TermCondition::first();

        return Inertia::render('front/syarat-ketentuan/index', [
            'settings' => $this->prepareSettings(),
            'term' => $term ? [
                'title' => $term->title,
                'body' => $term->body,
                'updated_at' => optional($term->updated_at)->toISOString(),
            ] : null,
        ]);
    }

    public function kebijakanPrivasi()
    {
        $policy = KebijakanPrivasi::first();

        return Inertia::render('front/kebijakan-privasi/index', [
            'settings' => $this->prepareSettings(),
            'policy' => $policy ? [
                'title' => $policy->title,
                'body' => $policy->body,
                'updated_at' => optional($policy->updated_at)->toISOString(),
            ] : null,
        ]);
    }

    public function faq()
    {
        return Inertia::render('front/faq/index', [
            'settings' => $this->prepareSettings(),
            'faqs' => Faq::select('id', 'question', 'answer')
                ->latest()
                ->get(),
        ]);
    }

    public function cekSertifikat()
    {
        return Inertia::render('front/certificates/check', [
            'settings' => $this->prepareSettings(),
        ]);
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
