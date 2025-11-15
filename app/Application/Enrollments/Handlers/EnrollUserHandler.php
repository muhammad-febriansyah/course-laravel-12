<?php

namespace App\Application\Enrollments\Handlers;

use App\Application\Enrollments\Commands\EnrollUserCommand;
use App\Domain\Enrollment\Contracts\EnrollmentRepositoryInterface;
use App\Domain\Enrollment\Enrollment;
use App\Domain\Enrollment\EnrollmentStatus;
use Carbon\CarbonImmutable;

class EnrollUserHandler
{
    public function __construct(
        private readonly EnrollmentRepositoryInterface $repository,
    ) {
    }

    public function handle(EnrollUserCommand $command): Enrollment
    {
        $status = EnrollmentStatus::fromString($command->status);

        $existing = $this->repository->findByUserAndKelas($command->userId, $command->kelasId);
        if ($existing) {
            return $existing;
        }

        $enrollment = Enrollment::new(
            userId: $command->userId,
            kelasId: $command->kelasId,
            status: $status,
            enrolledAt: CarbonImmutable::now(),
        );

        return $this->repository->create($enrollment);
    }
}
