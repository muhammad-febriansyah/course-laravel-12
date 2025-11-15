<?php

namespace App\Services;

use App\Models\Benefit;
use Illuminate\Support\Collection;

class BenefitService
{
    public function list(): Collection
    {
        return Benefit::latest()->get();
    }

    public function create(array $data): Benefit
    {
        return Benefit::create($data);
    }

    public function update(Benefit $benefit, array $data): Benefit
    {
        $benefit->update($data);

        return $benefit->refresh();
    }

    public function delete(Benefit $benefit): void
    {
        $benefit->delete();
    }
}

