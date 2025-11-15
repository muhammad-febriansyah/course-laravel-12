<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Quiz extends Model
{
    use HasFactory;

    protected $fillable = [
        'kelas_id',
        'question',
        'image',
        'point',
    ];

    protected $casts = [
        'point' => 'integer',
    ];

    // Relationships
    public function kelas(): BelongsTo
    {
        return $this->belongsTo(Kelas::class, 'kelas_id');
    }

    public function quizAnswers(): HasMany
    {
        return $this->hasMany(QuizAnswer::class);
    }

    public function getAnswerAttribute(): ?string
    {
        $answers = $this->relationLoaded('quizAnswers')
            ? $this->quizAnswers
            : $this->quizAnswers()->get();

        /** @var \App\Models\QuizAnswer|null $topAnswer */
        $topAnswer = $answers->sortByDesc('point')->first();

        return $topAnswer?->answer;
    }
}
