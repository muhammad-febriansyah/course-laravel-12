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

        // Get published reviews with user and kelas info
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

        return Inertia::render('front/home/index', [
            'settings' => $this->prepareSettings(),
            'features' => $features,
            'menus' => $menus,
            'reviews' => $reviews,
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

    public function kelas()
    {
        return Inertia::render('front/kelas/index', [
            'settings' => $this->prepareSettings(),
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
