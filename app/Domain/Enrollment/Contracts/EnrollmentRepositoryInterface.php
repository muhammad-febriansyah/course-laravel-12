<?php

namespace App\Domain\Enrollment\Contracts;

use App\Domain\Enrollment\Enrollment;

interface EnrollmentRepositoryInterface
{
    public function create(Enrollment $enrollment): Enrollment;

    public function findByUserAndKelas(int $userId, int $kelasId): ?Enrollment;

    /**
     * @return Enrollment[]
     */
    public function findActiveByUser(int $userId): array;
}
