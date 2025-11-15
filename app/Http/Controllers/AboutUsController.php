<?php

namespace App\Http\Controllers;

use App\Models\AboutUs;
use App\Services\FileUploadService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AboutUsController extends Controller
{
    public function __construct(
        private readonly FileUploadService $fileUploadService
    ) {
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $aboutUs = AboutUs::first();

        return Inertia::render('Admin/about-us/index', [
            'aboutUs' => $aboutUs,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:4096',
            'vision' => 'nullable|string',
            'mission' => 'nullable|string',
            'values' => 'nullable|array',
            'statistics' => 'nullable|array',
        ]);

        $aboutUs = AboutUs::first();

        // Handle image upload
        if ($request->hasFile('image')) {
            $validated['image'] = $this->fileUploadService->uploadImage(
                $request->file('image'),
                'about-us',
                $aboutUs?->image
            );
        } else {
            unset($validated['image']);
        }

        if ($aboutUs) {
            $aboutUs->update($validated);
        } else {
            AboutUs::create($validated);
        }

        return redirect()->route('admin.about-us.index')->with('success', 'Tentang Kami berhasil diperbarui');
    }
}
