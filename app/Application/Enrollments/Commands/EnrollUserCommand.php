<?php

namespace App\Application\Enrollments\Commands;

class EnrollUserCommand
{
    public function __construct(
        public readonly int $userId,
        public readonly int $kelasId,
        public readonly string $status = 'active',
    ) {
    }
}
