<?php

namespace App\Domain\AboutUs\Contracts;

use App\Models\AboutUs;

interface AboutUsRepositoryInterface
{
    /**
     * Get the about us content
     */
    public function get(): ?AboutUs;
}
