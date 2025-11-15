<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Video extends Model
{
    use HasFactory;

    protected $fillable = [
        'section_id',
        'title',
        'slug',
        'video',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($video) {
            if (empty($video->slug)) {
                $video->slug = Str::slug($video->title);
            }
        });
    }

    // Relationships
    public function section(): BelongsTo
    {
        return $this->belongsTo(Section::class);
    }

    // Helper method to convert YouTube URL to embed URL
    public function getEmbedUrlAttribute(): ?string
    {
        if (empty($this->video)) {
            return null;
        }

        // If already an embed URL, return as is
        if (str_contains($this->video, 'youtube.com/embed/')) {
            return $this->video;
        }

        // Extract video ID from various YouTube URL formats
        $videoId = $this->extractYoutubeId($this->video);

        return $videoId ? "https://www.youtube.com/embed/{$videoId}" : $this->video;
    }

    // Extract YouTube video ID from URL
    private function extractYoutubeId(string $url): ?string
    {
        $patterns = [
            '/youtube\.com\/watch\?v=([^&]+)/',           // https://www.youtube.com/watch?v=VIDEO_ID
            '/youtube\.com\/embed\/([^?]+)/',              // https://www.youtube.com/embed/VIDEO_ID
            '/youtu\.be\/([^?]+)/',                        // https://youtu.be/VIDEO_ID
            '/youtube\.com\/v\/([^?]+)/',                  // https://www.youtube.com/v/VIDEO_ID
        ];

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $url, $matches)) {
                return $matches[1];
            }
        }

        return null;
    }
}
