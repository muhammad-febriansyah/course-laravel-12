<?php

namespace App\Domain\Enrollment;

enum EnrollmentStatus: string
{
    case ACTIVE = 'active';
    case COMPLETED = 'completed';
    case EXPIRED = 'expired';

    public static function fromString(string $status): self
    {
        return match ($status) {
            self::ACTIVE->value => self::ACTIVE,
            self::COMPLETED->value => self::COMPLETED,
            self::EXPIRED->value => self::EXPIRED,
            default => throw new \InvalidArgumentException("Unknown enrollment status [{$status}]"),
        };
    }
}
