<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageService
{
    /**
     * Store the provided image in storage/app/public and return its storage path.
     *
     * @param UploadedFile $file
     * @param string $directory Directory inside storage/app/public (e.g., 'news', 'categories')
     * @param string|null $filenamePrefix Optional prefix for filename
     * @return string Returns the storage path (e.g., 'news/filename.jpg')
     */
    public function store(UploadedFile $file, string $directory, ?string $filenamePrefix = null): string
    {
        // Remove 'images/' prefix if exists (for backward compatibility)
        $directory = str_replace('images/', '', $directory);

        // Generate unique filename
        $uniqueSuffix = Str::uuid()->toString();
        $baseName = $filenamePrefix ?: pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $name = $baseName . '_' . $uniqueSuffix;
        $extension = $file->getClientOriginalExtension();
        $filename = $name . '.' . $extension;

        // Store in storage/app/public/{directory}
        $path = $file->storeAs($directory, $filename, 'public');

        // Return path without 'storage/' prefix
        return $path;
    }

    /**
     * Delete the given image from storage if it exists.
     *
     * @param string|null $path Storage path or old public path
     * @return void
     */
    public function delete(?string $path): void
    {
        if (!$path) {
            return;
        }

        // Handle old public paths (starts with /images/)
        if (Str::startsWith($path, '/images/') || Str::startsWith($path, 'images/')) {
            $fullPath = public_path($path);
            if (file_exists($fullPath)) {
                @unlink($fullPath);
            }
            return;
        }

        // Remove '/storage/' prefix if exists
        $path = str_replace('/storage/', '', $path);
        $path = str_replace('storage/', '', $path);

        // Delete from storage/app/public
        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }

    /**
     * Get full URL for storage file
     *
     * @param string|null $path
     * @return string|null
     */
    public function url(?string $path): ?string
    {
        if (!$path) {
            return null;
        }

        // If it's an old public path, return as is
        if (Str::startsWith($path, '/images/') || Str::startsWith($path, 'images/')) {
            return '/' . ltrim($path, '/');
        }

        // If path already starts with http, return as is
        if (Str::startsWith($path, 'http://') || Str::startsWith($path, 'https://')) {
            return $path;
        }

        // Remove '/storage/' prefix if exists
        $path = str_replace('/storage/', '', $path);
        $path = str_replace('storage/', '', $path);

        // Return storage URL
        return Storage::disk('public')->url($path);
    }
}
