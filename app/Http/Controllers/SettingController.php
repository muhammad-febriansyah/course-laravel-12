<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function __construct(
        protected ImageService $imageService,
    ) {
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $setting = Setting::first();

        if ($setting) {
            $setting->logo = $this->imageService->url($setting->logo);
            $setting->favicon = $this->imageService->url($setting->favicon);
            $setting->thumbnail = $this->imageService->url($setting->thumbnail);
            $setting->home_thumbnail = $this->imageService->url($setting->home_thumbnail);
        }

        return Inertia::render('settings/website', [
            'setting' => $setting,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'site_name' => 'required|string|max:255',
            'keyword' => 'required|string',
            'email' => 'required|email|max:255',
            'address' => 'required|string',
            'maps_embed_url' => 'nullable|string',
            'phone' => 'required|string|max:255',
            'desc' => 'required|string',
            'yt' => 'nullable|url|max:255',
            'ig' => 'nullable|url|max:255',
            'tiktok' => 'nullable|url|max:255',
            'fb' => 'nullable|url|max:255',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,svg|max:2048',
            'favicon' => 'nullable|image|mimes:ico,png|max:1024',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg|max:4096',
            'home_thumbnail' => 'nullable|image|mimes:jpeg,png,jpg|max:4096',
            'hero_title' => 'nullable|string|max:255',
            'hero_subtitle' => 'nullable|string',
            'hero_stat1_number' => 'nullable|string|max:50',
            'hero_stat1_label' => 'nullable|string|max:100',
            'hero_stat2_number' => 'nullable|string|max:50',
            'hero_stat2_label' => 'nullable|string|max:100',
            'hero_stat3_number' => 'nullable|string|max:50',
            'hero_stat3_label' => 'nullable|string|max:100',
            'hero_badge_title' => 'nullable|string|max:255',
            'hero_badge_subtitle' => 'nullable|string|max:255',
            'hero_active_label' => 'nullable|string|max:100',
            'hero_active_value' => 'nullable|string|max:100',
            'fee' => 'required|numeric|min:0|max:100',
        ]);

        $setting = Setting::first();

        $fileFields = [
            'logo' => ['directory' => 'settings/logos', 'prefix' => 'logo'],
            'favicon' => ['directory' => 'settings/favicons', 'prefix' => 'favicon'],
            'thumbnail' => ['directory' => 'settings/thumbnails', 'prefix' => 'thumbnail'],
            'home_thumbnail' => ['directory' => 'settings/home-thumbnails', 'prefix' => 'home_thumbnail'],
        ];

        foreach ($fileFields as $field => $options) {
            if ($request->hasFile($field)) {
                $this->imageService->delete($setting?->$field ?? null);

                $validated[$field] = $this->imageService->store(
                    $request->file($field),
                    $options['directory'],
                    $options['prefix']
                );
            } else {
                unset($validated[$field]);
            }
        }

        // Extract URL from Google Maps embed HTML if full iframe tag is provided
        if (!empty($validated['maps_embed_url'])) {
            $mapsEmbedUrl = $validated['maps_embed_url'];

            // Check if it contains iframe tag
            if (str_contains($mapsEmbedUrl, '<iframe')) {
                // Extract src URL from iframe tag
                if (preg_match('/src=["\']([^"\']+)["\']/', $mapsEmbedUrl, $matches)) {
                    $validated['maps_embed_url'] = $matches[1];
                }
            }
        }

        $setting->update($validated);

        return redirect()->route('admin.settings.index')->with('success', 'Pengaturan berhasil diperbarui');
    }
}
