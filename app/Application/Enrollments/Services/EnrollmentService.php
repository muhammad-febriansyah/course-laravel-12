<?php

namespace App\Application\Enrollments\Services;

use App\Application\Enrollments\Commands\EnrollUserCommand;
use App\Application\Enrollments\Handlers\EnrollUserHandler;
use App\Domain\Enrollment\Enrollment;

class EnrollmentService
{
    public function __construct(
        private readonly EnrollUserHandler $handler,
    ) {
    }

    public function enroll(int $userId, int $kelasId, string $status = 'active'): Enrollment
    {
        return $this->handler->handle(
            new EnrollUserCommand(
                userId: $userId,
                kelasId: $kelasId,
                status: $status,
            )
        );
    }
}
