<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class News extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'title',
        'slug',
        'desc',
        'body',
        'image',
        'status',
        'views',
    ];

    protected $casts = [
        'status' => 'boolean',
        'views' => 'integer',
    ];

    protected $appends = ['image_url'];

    public function category(): BelongsTo
    {
        return $this->belongsTo(NewsCategory::class, 'category_id');
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
