<?php

namespace App\Models;

use App\Models\Enrollment;
use App\Models\Transaction;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Kelas extends Model
{
    use HasFactory;

    public const STATUS_DRAFT = 'draft';
    public const STATUS_PENDING = 'pending';
    public const STATUS_APPROVED = 'approved';
    public const STATUS_REJECTED = 'rejected';

    protected $table = 'kelas';

    protected $fillable = [
        'category_id',
        'type_id',
        'level_id',
        'user_id',
        'title',
        'slug',
        'price',
        'discount',
        'benefit',
        'desc',
        'body',
        'image',
        'status',
        'approved_at',
        'rejected_at',
        'rejected_reason',
        'views',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'discount' => 'decimal:2',
        'views' => 'integer',
        'status' => 'string',
        'approved_at' => 'datetime',
        'rejected_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($kelas) {
            if (empty($kelas->slug)) {
                $kelas->slug = Str::slug($kelas->title);
            }
        });
    }

    // Relationships
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function type(): BelongsTo
    {
        return $this->belongsTo(Type::class);
    }

    public function level(): BelongsTo
    {
        return $this->belongsTo(Level::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function sections(): HasMany
    {
        return $this->hasMany(Section::class, 'kelas_id')->orderBy('id');
    }

    public function quizzes(): HasMany
    {
        return $this->hasMany(Quiz::class, 'kelas_id')
            ->with('quizAnswers')
            ->orderBy('id');
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class, 'kelas_id');
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class, 'kelas_id');
    }

    public function discussions(): HasMany
    {
        return $this->hasMany(Discussion::class, 'kelas_id');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class, 'kelas_id');
    }

    // Helper methods
    public function averageRating(): float
    {
        return round($this->reviews()->published()->avg('rating') ?? 0, 1);
    }

    public function totalReviews(): int
    {
        return $this->reviews()->published()->count();
    }
}
