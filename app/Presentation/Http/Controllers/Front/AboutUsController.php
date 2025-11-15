<?php

namespace App\Presentation\Http\Controllers\Front;

use App\Application\AboutUs\Services\AboutUsService;
use App\Http\Controllers\Controller;
use App\Models\Feature;
use App\Models\Setting;
use App\Services\ImageService;
use Inertia\Inertia;
use Inertia\Response;

class AboutUsController extends Controller
{
    public function __construct(
        private readonly AboutUsService $aboutUsService,
        private readonly ImageService $imageService,
    ) {}

    public function __invoke(): Response
    {
        $aboutUs = $this->aboutUsService->getAboutUs();
        $features = Feature::query()
            ->where('is_active', true)
            ->orderBy('order')
            ->get(['id', 'title', 'description', 'icon', 'order']);

        return Inertia::render('front/tentang-kami/index', [
            'settings' => $this->prepareSettings(),
            'aboutUs' => $aboutUs ? [
                'title' => $aboutUs->title,
                'body' => $aboutUs->body,
                'image' => $this->imageService->url($aboutUs->image),
                'vision' => $aboutUs->vision,
                'mission' => $aboutUs->mission,
                'values' => $this->normalizeArray($aboutUs->values),
                'statistics' => $this->normalizeArray($aboutUs->statistics),
            ] : null,
            'features' => $features->map(fn (Feature $feature) => [
                'id' => $feature->id,
                'title' => $feature->title,
                'description' => $feature->description,
                'icon' => $feature->icon,
                'order' => $feature->order,
            ])->values(),
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

    /**
     * Normalize JSON column value to a simple array structure.
     *
     * @param mixed $value
     * @return array<int, array<string, mixed>>
     */
    protected function normalizeArray(mixed $value): array
    {
        if (is_null($value)) {
            return [];
        }

        if ($value instanceof \Illuminate\Support\Collection) {
            $value = $value->toArray();
        }

        if (! is_array($value)) {
            $value = (array) $value;
        }

        // If associative (e.g., ['0' => [...]]), ensure numeric keys and each item is array
        $normalized = [];
        foreach ($value as $item) {
            if ($item instanceof \Illuminate\Support\Collection) {
                $item = $item->toArray();
            } elseif (! is_array($item)) {
                $item = (array) $item;
            }

            if (! empty($item)) {
                $normalized[] = $item;
            }
        }

        return $normalized;
    }
}
