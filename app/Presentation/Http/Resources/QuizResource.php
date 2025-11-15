<?php

namespace App\Presentation\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class QuizResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'question' => $this->question,
            'point' => $this->point,
            'answer' => $this->answer,
            'answers' => $this->whenLoaded(
                'quizAnswers',
                fn () => $this->quizAnswers->map(fn ($answer) => [
                    'id' => $answer->id,
                    'answer' => $answer->answer,
                    'point' => $answer->point,
                ]),
            ),
        ];
    }
}
