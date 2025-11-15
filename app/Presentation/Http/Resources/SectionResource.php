<?php

namespace App\Presentation\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SectionResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'videos' => VideoResource::collection($this->whenLoaded('videos')),
        ];
    }
}
