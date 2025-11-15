<?php

namespace App\Presentation\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class EnrollmentResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status,
            'enrolledAt' => optional($this->enrolled_at)->toDateTimeString(),
            'completedAt' => optional($this->completed_at)->toDateTimeString(),
            'expiresAt' => optional($this->expires_at)->toDateTimeString(),
            'course' => $this->whenLoaded('kelas', fn () => CourseResource::make($this->kelas)->resolve()),
            'progress' => round((float) ($this->progress_percentage ?? 0), 1),
            'videosCompleted' => (int) ($this->videos_completed ?? 0),
            'quizzesCompleted' => (int) ($this->quizzes_completed ?? 0),
            'lastAccessedAt' => optional($this->last_accessed_at)->toDateTimeString(),
        ];
    }
}
