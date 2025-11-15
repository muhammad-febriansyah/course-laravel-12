<?php

namespace App\Services;

use App\Models\Level;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;

class LevelService
{
    public function __construct(
        protected ImageService $imageService,
    ) {
    }

    public function list(): Collection
    {
        return Level::latest()
            ->get()
            ->map(function (Level $level) {
                return [
                    'id' => $level->id,
                    'name' => $level->name,
                    'image' => $this->imageService->url($level->image),
                    'created_at' => optional($level->created_at)->toISOString(),
                    'updated_at' => optional($level->updated_at)->toISOString(),
                ];
            });
    }

    public function create(array $data): Level
    {
        if ($data['image'] instanceof UploadedFile) {
            $data['image'] = $this->imageService->store(
                $data['image'],
                'images/levels',
                'level'
            );
        }

        return Level::create([
            'name' => $data['name'],
            'image' => $data['image'],
        ]);
    }

    public function update(Level $level, array $data): Level
    {
        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
            $this->imageService->delete($level->image);

            $data['image'] = $this->imageService->store(
                $data['image'],
                'images/levels',
                'level'
            );
        } else {
            unset($data['image']);
        }

        $level->update($data);

        return $level->refresh();
    }

    public function delete(Level $level): void
    {
        $this->imageService->delete($level->image);

        $level->delete();
    }
}
