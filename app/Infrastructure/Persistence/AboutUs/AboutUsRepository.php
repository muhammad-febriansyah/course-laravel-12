<?php

namespace App\Infrastructure\Persistence\AboutUs;

use App\Domain\AboutUs\Contracts\AboutUsRepositoryInterface;
use App\Models\AboutUs;

class AboutUsRepository implements AboutUsRepositoryInterface
{
    /**
     * Get the about us content
     */
    public function get(): ?AboutUs
    {
        return AboutUs::first();
    }
}
