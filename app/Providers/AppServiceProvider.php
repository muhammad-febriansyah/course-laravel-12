<?php

namespace App\Providers;

use App\Domain\AboutUs\Contracts\AboutUsRepositoryInterface;
use App\Domain\Enrollment\Contracts\EnrollmentRepositoryInterface;
use App\Infrastructure\Persistence\AboutUs\AboutUsRepository;
use App\Infrastructure\Persistence\Repositories\EloquentEnrollmentRepository;
use App\Models\Setting;
use App\Services\ImageService;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(
            EnrollmentRepositoryInterface::class,
            EloquentEnrollmentRepository::class
        );

        $this->app->bind(
            AboutUsRepositoryInterface::class,
            AboutUsRepository::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Share settings data with all views
        View::composer('*', function ($view) {
            $imageService = app(ImageService::class);
            $settings = Setting::first();

            $view->with('settings', $settings ? [
                'site_name' => $settings->site_name,
                'logo' => $imageService->url($settings->logo),
                'favicon' => $imageService->url($settings->favicon),
                'thumbnail' => $imageService->url($settings->thumbnail),
                'home_thumbnail' => $imageService->url($settings->home_thumbnail),
                'desc' => $settings->desc,
                'keyword' => $settings->keyword,
            ] : [
                'site_name' => config('app.name'),
                'logo' => null,
                'favicon' => null,
                'thumbnail' => null,
                'home_thumbnail' => null,
                'desc' => 'Platform pembelajaran online terbaik',
                'keyword' => 'kursus online, belajar online, pelatihan',
            ]);
        });
    }
}
