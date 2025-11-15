<?php

namespace App\Services;

use App\Models\Type;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;

class TypeService
{
    public function __construct(
        protected ImageService $imageService,
    ) {
    }

    public function list(): Collection
    {
        return Type::latest()
            ->get()
            ->map(function (Type $type) {
                return [
                    'id' => $type->id,
                    'name' => $type->name,
                    'slug' => $type->slug,
                    'image' => $this->imageService->url($type->image),
                    'created_at' => optional($type->created_at)->toISOString(),
                    'updated_at' => optional($type->updated_at)->toISOString(),
                ];
            });
    }

    public function create(array $data): Type
    {
        if ($data['image'] instanceof UploadedFile) {
            $data['image'] = $this->imageService->store(
                $data['image'],
                'images/types',
                'type'
            );
        }

        return Type::create([
            'name' => $data['name'],
            'image' => $data['image'],
        ]);
    }

    public function update(Type $type, array $data): Type
    {
        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
            $this->imageService->delete($type->image);

            $data['image'] = $this->imageService->store(
                $data['image'],
                'images/types',
                'type'
            );
        } else {
            unset($data['image']);
        }

        $type->update($data);

        return $type->refresh();
    }

    public function delete(Type $type): void
    {
        $this->imageService->delete($type->image);

        $type->delete();
    }
}
