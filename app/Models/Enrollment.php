<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Enrollment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'kelas_id',
        'status',
        'progress_percentage',
        'videos_completed',
        'quizzes_completed',
        'last_accessed_at',
        'enrolled_at',
        'completed_at',
        'expires_at',
    ];

    protected $casts = [
        'progress_percentage' => 'decimal:2',
        'videos_completed' => 'integer',
        'quizzes_completed' => 'integer',
        'last_accessed_at' => 'datetime',
        'enrolled_at' => 'datetime',
        'completed_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function kelas(): BelongsTo
    {
        return $this->belongsTo(Kelas::class);
    }
}
