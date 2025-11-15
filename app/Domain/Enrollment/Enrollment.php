<?php

namespace App\Domain\Enrollment;

use Carbon\CarbonImmutable;

class Enrollment
{
    public function __construct(
        private readonly ?int $id,
        private readonly int $userId,
        private readonly int $kelasId,
        private readonly EnrollmentStatus $status,
        private readonly CarbonImmutable $enrolledAt,
        private readonly ?CarbonImmutable $completedAt = null,
        private readonly ?CarbonImmutable $expiresAt = null,
    ) {
    }

    public static function new(int $userId, int $kelasId, EnrollmentStatus $status, CarbonImmutable $enrolledAt): self
    {
        return new self(
            id: null,
            userId: $userId,
            kelasId: $kelasId,
            status: $status,
            enrolledAt: $enrolledAt,
        );
    }

    public function id(): ?int
    {
        return $this->id;
    }

    public function userId(): int
    {
        return $this->userId;
    }

    public function kelasId(): int
    {
        return $this->kelasId;
    }

    public function status(): EnrollmentStatus
    {
        return $this->status;
    }

    public function enrolledAt(): CarbonImmutable
    {
        return $this->enrolledAt;
    }

    public function completedAt(): ?CarbonImmutable
    {
        return $this->completedAt;
    }

    public function expiresAt(): ?CarbonImmutable
    {
        return $this->expiresAt;
    }

    public function markCompleted(CarbonImmutable $completedAt): self
    {
        return new self(
            id: $this->id,
            userId: $this->userId,
            kelasId: $this->kelasId,
            status: EnrollmentStatus::COMPLETED,
            enrolledAt: $this->enrolledAt,
            completedAt: $completedAt,
            expiresAt: $this->expiresAt,
        );
    }

    public function markExpired(CarbonImmutable $expiredAt): self
    {
        return new self(
            id: $this->id,
            userId: $this->userId,
            kelasId: $this->kelasId,
            status: EnrollmentStatus::EXPIRED,
            enrolledAt: $this->enrolledAt,
            completedAt: $this->completedAt,
            expiresAt: $expiredAt,
        );
    }
}
