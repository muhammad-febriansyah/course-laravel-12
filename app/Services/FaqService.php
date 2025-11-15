<?php

namespace App\Services;

use App\Models\Faq;
use Illuminate\Support\Collection;

class FaqService
{
    public function list(): Collection
    {
        return Faq::latest()->get();
    }

    public function create(array $data): Faq
    {
        return Faq::create($data);
    }

    public function update(Faq $faq, array $data): Faq
    {
        $faq->update($data);

        return $faq->refresh();
    }

    public function delete(Faq $faq): void
    {
        $faq->delete();
    }
}

