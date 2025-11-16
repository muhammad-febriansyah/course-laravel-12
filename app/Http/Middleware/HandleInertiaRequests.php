<?php

namespace App\Http\Middleware;

use App\Services\ImageService;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Menu;
use App\Models\Setting;
use Illuminate\Support\Collection;
use function collect;

class HandleInertiaRequests extends Middleware
{
    /**
     * Mapping of legacy menu URLs to their latest admin-prefixed URLs.
     *
     * @var array<string, string>
     */
    protected array $menuUrlMap = [
        '/users' => '/admin/users',
        '/dashboard' => '/admin/dashboard',
        '/kelas' => '/admin/kelas',
        '/categories' => '/admin/categories',
        '/levels' => '/admin/levels',
        '/types' => '/admin/types',
        '/promo-codes' => '/admin/promo-codes',
        '/benefits' => '/admin/benefits',
        '/transactions' => '/admin/transactions',
        '/faqs' => '/admin/faqs',
        '/pengaturan' => '/admin/pengaturan',
        '/term-conditions' => '/admin/term-conditions',
        '/kebijakan-privasi' => '/admin/kebijakan-privasi',
        '/news' => '/admin/news',
        '/news-categories' => '/admin/news-categories',
        '/certificates' => '/admin/certificates',
        '/visi-misi' => '/admin/visi-misi',
    ];

    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define data that is shared with the root view.
     *
     * @return array<string, mixed>
     */
    public function viewData(Request $request): array
    {
        $settings = Setting::first();

        return [
            'settings' => $settings ? [
                'site_name' => $settings->site_name,
                'logo' => $this->resolveSettingAsset($settings->logo),
                'favicon' => $this->resolveSettingAsset($settings->favicon),
                'thumbnail' => $this->resolveSettingAsset($settings->thumbnail),
                'home_thumbnail' => $this->resolveSettingAsset($settings->home_thumbnail),
                'desc' => $settings->desc,
                'keyword' => $settings->keyword,
            ] : [
                'site_name' => config('app.name'),
                'logo' => null,
                'favicon' => null,
                'thumbnail' => null,
                'home_thumbnail' => null,
                'desc' => null,
                'keyword' => null,
            ],
        ];
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        $settings = Setting::first();

        $menus = $this->normalizeMenuCollection(
            Menu::active()
                ->parent()
                ->with(['children' => function ($query) {
                    $query->active()->orderBy('order');
                }])
                ->orderBy('order')
                ->get()
        );

        if (! $menus->contains(fn (Menu $menu) => ($menu->url ?? null) === '/admin/dashboard')) {
            $dashboardMenu = Menu::make([
                'id' => 0,
                'name' => 'dashboard',
                'title' => 'Beranda',
                'url' => '/admin/dashboard',
                'icon' => 'dashboard',
                'parent_id' => null,
                'order' => 0,
                'is_active' => true,
            ]);
            $dashboardMenu->setRelation('children', collect());
            $menus->prepend($dashboardMenu);
        }

        $hasVisiMisiMenu = $menus->contains(function (Menu $menu) {
            if (($menu->url ?? null) === '/admin/visi-misi') {
                return true;
            }

            if ($menu->relationLoaded('children')) {
                return $menu->children->contains(fn (Menu $child) => ($child->url ?? null) === '/admin/visi-misi');
            }

            return false;
        });

        if (! $hasVisiMisiMenu) {
            $settingsMenu = $menus->first(fn (Menu $menu) => $menu->name === 'settings');

            $visiMisiMenu = Menu::make([
                'name' => 'visi_misi',
                'title' => 'Visi & Misi',
                'url' => '/admin/visi-misi',
                'icon' => 'target',
                'parent_id' => $settingsMenu?->id,
                'order' => 4,
                'is_active' => true,
            ]);
            $visiMisiMenu->setAttribute('id', 'virtual-visi-misi');
            $visiMisiMenu->setRelation('children', collect());

            if ($settingsMenu) {
                $children = $settingsMenu->relationLoaded('children')
                    ? $settingsMenu->children
                    : collect();

                $children = $children->push($visiMisiMenu)->sortBy('order')->values();
                $settingsMenu->setRelation('children', $children);
            } else {
                $menus->push($visiMisiMenu);
            }
        }

        $user = $request->user();

        $menus = $this->transformMenusForRole($menus, $user?->role);

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $user,
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'menus' => $menus,
            'settings' => $settings ? [
                'site_name' => $settings->site_name,
                'logo' => $this->resolveSettingAsset($settings->logo),
                'favicon' => $this->resolveSettingAsset($settings->favicon),
                'thumbnail' => $this->resolveSettingAsset($settings->thumbnail),
                'home_thumbnail' => $this->resolveSettingAsset($settings->home_thumbnail),
                'desc' => $settings->desc,
            ] : null,
        ];
    }

    /**
     * Ensure menu URLs follow the latest admin-prefixed structure.
     *
     * @param  \Illuminate\Support\Collection<int, \App\Models\Menu>  $menus
     */
    protected function normalizeMenuCollection(Collection $menus): Collection
    {
        return $menus->map(function (Menu $menu) {
            $menu->url = $this->normalizeMenuUrl($menu->url);

            if ($menu->relationLoaded('children')) {
                $menu->setRelation('children', $this->normalizeMenuCollection($menu->children));
            }

            return $menu;
        })->filter(fn (Menu $menu) => $this->shouldDisplayMenu($menu))->values();
    }

    protected function normalizeMenuUrl(?string $url): ?string
    {
        if (! $url) {
            return $url;
        }

        $trimmed = rtrim($url, '/');

        if ($trimmed === '') {
            return $url;
        }

        if (! str_starts_with($trimmed, '/')) {
            $trimmed = '/' . $trimmed;
        }

        return $this->menuUrlMap[$trimmed] ?? $url;
    }

    protected function shouldDisplayMenu(Menu $menu): bool
    {
        $hiddenPaths = ['/settings/appearance', '/settings/two-factor'];
        if ($menu->url && in_array($menu->url, $hiddenPaths, true)) {
            return false;
        }

        if ($menu->relationLoaded('children')) {
            $children = $menu->children;
            if ($children instanceof Collection) {
                if ($children->isNotEmpty()) {
                    return true;
                }

                return (bool) $menu->url;
            }
        }

        return true;
    }

    protected function transformMenusForRole(Collection $menus, ?string $role): Collection
    {
        if ($role === 'mentor') {
            $allowedTop = ['dashboard', 'courses'];
            $allowedChildren = [
                'courses' => ['kelas'],
            ];

            $mentorMenus = collect([
                [
                    'title' => 'Dashboard',
                    'href' => '/mentor/dashboard',
                    'icon' => 'dashboard',
                ],
                [
                    'title' => 'Kelas',
                    'href' => '/mentor/kelas',
                    'icon' => 'class',
                ],
                [
                    'title' => 'Diskusi',
                    'href' => '/mentor/diskusi',
                    'icon' => 'message-circle-question',
                ],
            ]);

            return $mentorMenus;
        }

        if (! $role || $role === 'user') {
            return collect([
                [
                    'title' => 'Dashboard',
                    'href' => '/dashboard',
                    'icon' => 'layout-dashboard',
                ],
                [
                    'title' => 'Belajar',
                    'href' => '/dashboard/learn',
                    'icon' => 'book-open',
                ],
                [
                    'title' => 'Kelas Saya',
                    'href' => '/dashboard/purchases',
                    'icon' => 'library',
                ],
                [
                    'title' => 'Sertifikat',
                    'href' => '/dashboard/certificates',
                    'icon' => 'award',
                ],
                [
                    'title' => 'Histori Transaksi',
                    'href' => '/dashboard/transactions',
                    'icon' => 'receipt-text',
                ],
                [
                    'title' => 'Profil',
                    'href' => '/dashboard/profile',
                    'icon' => 'user-circle',
                ],
            ]);
        }

        return $menus;
    }

    protected function resolveSettingAsset(?string $path): ?string
    {
        return app(ImageService::class)->url($path);
    }

}
