<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AboutUs extends Model
{
    protected $table = 'about_us';

    protected $fillable = [
        'title',
        'body',
        'image',
        'vision',
        'mission',
        'values',
        'statistics',
    ];

    protected $casts = [
        'values' => 'array',
        'statistics' => 'array',
    ];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute(): ?string
    {
        if (!$this->image) {
            return null;
        }

        // If it's an old public path (starts with /images/)
        if (str_starts_with($this->image, '/images/') || str_starts_with($this->image, 'images/')) {
            return '/' . ltrim($this->image, '/');
        }

        // If already a full URL
        if (str_starts_with($this->image, 'http://') || str_starts_with($this->image, 'https://')) {
            return $this->image;
        }

        // Return storage URL
        return '/storage/' . $this->image;
    }
}
