<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class NewsCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'image',
    ];

    protected $appends = ['image_url'];

    public function news(): HasMany
    {
        return $this->hasMany(News::class, 'category_id');
    }

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
