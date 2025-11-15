<?php

namespace App\Presentation\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CourseResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray($request): array
    {
        $benefits = collect(
            preg_split('/\r?\n/', (string) $this->benefit, -1, PREG_SPLIT_NO_EMPTY),
        )
            ->map(fn ($item) => trim((string) $item))
            ->filter()
            ->values()
            ->all();

        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'price' => (float) $this->price,
            'discount' => (float) $this->discount,
            'finalPrice' => (float) max($this->price - $this->discount, 0),
            'image' => $this->image,
            'shortDescription' => $this->desc,
            'body' => $this->body,
            'benefits' => $benefits,
            'level' => $this->whenLoaded('level', fn () => [
                'id' => $this->level?->id,
                'name' => $this->level?->name,
            ]),
            'type' => $this->whenLoaded('type', fn () => [
                'id' => $this->type?->id,
                'name' => $this->type?->name,
            ]),
            'category' => $this->whenLoaded('category', fn () => [
                'id' => $this->category?->id,
                'name' => $this->category?->name,
            ]),
            'instructor' => $this->whenLoaded('user', fn () => [
                'id' => $this->user?->id,
                'name' => $this->user?->name,
                'avatar' => $this->user?->avatar,
            ]),
            'sections' => SectionResource::collection($this->whenLoaded('sections')),
            'quizzes' => QuizResource::collection($this->whenLoaded('quizzes')),
            'reviews' => $this->whenLoaded('reviews', function () use ($request) {
                return ReviewResource::collection($this->reviews)->resolve($request);
            }),
            'views' => (int) $this->views,
        ];
    }
}
