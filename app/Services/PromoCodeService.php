<?php

namespace App\Services;

use App\Models\PromoCode;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;

class PromoCodeService
{
    public function __construct(
        protected ImageService $imageService,
    ) {
    }

    public function list(): Collection
    {
        return PromoCode::latest()
            ->get()
            ->map(function (PromoCode $promoCode) {
                return [
                    'id' => $promoCode->id,
                    'name' => $promoCode->name,
                    'code' => $promoCode->code,
                    'discount' => (int) $promoCode->discount,
                    'status' => (bool) $promoCode->status,
                    'image' => $this->imageService->url($promoCode->image),
                    'created_at' => optional($promoCode->created_at)->toISOString(),
                    'updated_at' => optional($promoCode->updated_at)->toISOString(),
                ];
            });
    }

    public function create(array $data): PromoCode
    {
        if ($data['image'] instanceof UploadedFile) {
            $data['image'] = $this->imageService->store(
                $data['image'],
                'images/promo-codes',
                'promo'
            );
        }

        $data['discount'] = (int) $data['discount'];
        $data['status'] = (int) $data['status'];

        return PromoCode::create([
            'name' => $data['name'],
            'code' => $data['code'],
            'discount' => $data['discount'],
            'status' => $data['status'],
            'image' => $data['image'],
        ]);
    }

    public function update(PromoCode $promoCode, array $data): PromoCode
    {
        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
            $this->imageService->delete($promoCode->image);

            $data['image'] = $this->imageService->store(
                $data['image'],
                'images/promo-codes',
                'promo'
            );
        } else {
            unset($data['image']);
        }

        if (isset($data['discount'])) {
            $data['discount'] = (int) $data['discount'];
        }

        if (isset($data['status'])) {
            $data['status'] = (int) $data['status'];
        }

        $promoCode->update($data);

        return $promoCode->refresh();
    }

    public function delete(PromoCode $promoCode): void
    {
        $this->imageService->delete($promoCode->image);

        $promoCode->delete();
    }
}
