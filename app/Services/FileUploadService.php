<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileUploadService
{
    /**
     * Upload file to storage
     *
     * @param UploadedFile $file
     * @param string $directory Directory inside storage/app/public
     * @param string|null $oldPath Old file path to delete
     * @return string Returns the storage path (without 'storage/' prefix)
     */
    public function upload(UploadedFile $file, string $directory, ?string $oldPath = null): string
    {
        // Delete old file if exists
        if ($oldPath) {
            $this->delete($oldPath);
        }

        // Generate unique filename
        $filename = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();

        // Store file in storage/app/public/{directory}
        $path = $file->storeAs($directory, $filename, 'public');

        // Return path without 'storage/' prefix (will be added when displaying)
        return $path;
    }

    /**
     * Upload image with validation
     *
     * @param UploadedFile $file
     * @param string $directory
     * @param string|null $oldPath
     * @param array $allowedMimes
     * @param int $maxSize in KB
     * @return string
     */
    public function uploadImage(
        UploadedFile $file,
        string $directory,
        ?string $oldPath = null,
        array $allowedMimes = ['jpeg', 'png', 'jpg', 'gif', 'webp', 'svg'],
        int $maxSize = 4096
    ): string {
        // Validate mime type
        $extension = $file->getClientOriginalExtension();
        if (!in_array(strtolower($extension), $allowedMimes)) {
            throw new \InvalidArgumentException('Invalid image type. Allowed: ' . implode(', ', $allowedMimes));
        }

        // Validate size
        if ($file->getSize() > ($maxSize * 1024)) {
            throw new \InvalidArgumentException("Image size must not exceed {$maxSize}KB");
        }

        return $this->upload($file, $directory, $oldPath);
    }

    /**
     * Delete file from storage
     *
     * @param string $path
     * @return bool
     */
    public function delete(string $path): bool
    {
        if (!$path) {
            return false;
        }

        // Remove '/storage/' prefix if exists
        $path = str_replace('/storage/', '', $path);
        $path = str_replace('storage/', '', $path);

        // Delete from storage/app/public
        if (Storage::disk('public')->exists($path)) {
            return Storage::disk('public')->delete($path);
        }

        return false;
    }

    /**
     * Delete image from storage (alias for delete method)
     *
     * @param string $path
     * @return bool
     */
    public function deleteImage(string $path): bool
    {
        return $this->delete($path);
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

    /**
     * Check if file exists in storage
     *
     * @param string $path
     * @return bool
     */
    public function exists(string $path): bool
    {
        // Remove '/storage/' prefix if exists
        $path = str_replace('/storage/', '', $path);
        $path = str_replace('storage/', '', $path);

        return Storage::disk('public')->exists($path);
    }
}
