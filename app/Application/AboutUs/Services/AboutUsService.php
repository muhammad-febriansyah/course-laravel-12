<?php

namespace App\Application\AboutUs\Services;

use App\Domain\AboutUs\Contracts\AboutUsRepositoryInterface;
use App\Models\AboutUs;

class AboutUsService
{
    public function __construct(
        private readonly AboutUsRepositoryInterface $repository
    ) {
    }

    /**
     * Get about us content
     */
    public function getAboutUs(): ?AboutUs
    {
        return $this->repository->get();
    }
}
