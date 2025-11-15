<?php

namespace App\Infrastructure\Persistence\Repositories;

use App\Domain\Enrollment\Contracts\EnrollmentRepositoryInterface;
use App\Domain\Enrollment\Enrollment;
use App\Domain\Enrollment\EnrollmentStatus;
use App\Models\Enrollment as EnrollmentModel;
use Carbon\CarbonImmutable;

class EloquentEnrollmentRepository implements EnrollmentRepositoryInterface
{
    public function create(Enrollment $enrollment): Enrollment
    {
        $model = EnrollmentModel::create([
            'user_id' => $enrollment->userId(),
            'kelas_id' => $enrollment->kelasId(),
            'status' => $enrollment->status()->value,
            'enrolled_at' => $enrollment->enrolledAt(),
            'completed_at' => $enrollment->completedAt(),
            'expires_at' => $enrollment->expiresAt(),
        ]);

        return $this->mapToDomain($model);
    }

    public function findByUserAndKelas(int $userId, int $kelasId): ?Enrollment
    {
        $model = EnrollmentModel::where('user_id', $userId)
            ->where('kelas_id', $kelasId)
            ->latest('id')
            ->first();

        return $model ? $this->mapToDomain($model) : null;
    }

    public function findActiveByUser(int $userId): array
    {
        return EnrollmentModel::where('user_id', $userId)
            ->where('status', EnrollmentStatus::ACTIVE->value)
            ->get()
            ->map(fn (EnrollmentModel $model) => $this->mapToDomain($model))
            ->all();
    }

    private function mapToDomain(EnrollmentModel $model): Enrollment
    {
        $enrolledAt = $model->enrolled_at ?? $model->created_at ?? now();

        return new Enrollment(
            id: $model->id,
            userId: $model->user_id,
            kelasId: $model->kelas_id,
            status: EnrollmentStatus::fromString($model->status),
            enrolledAt: CarbonImmutable::make($enrolledAt),
            completedAt: $model->completed_at ? CarbonImmutable::make($model->completed_at) : null,
            expiresAt: $model->expires_at ? CarbonImmutable::make($model->expires_at) : null,
        );
    }
}
