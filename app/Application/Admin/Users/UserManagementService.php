<?php

namespace App\Application\Admin\Users;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserManagementService
{
    /**
     * @param array<string, mixed> $data
     */
    public function create(array $data): User
    {
        $payload = $this->prepareData($data);

        return User::create($payload);
    }

    /**
     * @param array<string, mixed> $data
     */
    public function update(User $user, array $data): User
    {
        $payload = $this->prepareData($data, $user);

        $user->update($payload);

        return $user->refresh();
    }

    public function delete(User $user): void
    {
        $user->delete();
    }

    /**
     * @param array<string, mixed> $data
     * @return array<string, mixed>
     */
    private function prepareData(array $data, ?User $user = null): array
    {
        $payload = [
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => empty($data['phone']) ? null : $data['phone'],
            'address' => empty($data['address']) ? null : $data['address'],
            'role' => empty($data['role']) ? null : $data['role'],
            'status' => (int) ($data['status'] ?? 1),
            'avatar' => $data['avatar'] ?? $user?->avatar,
        ];

        if (!empty($data['password'])) {
            $payload['password'] = Hash::make($data['password']);
        } elseif (!$user) {
            $payload['password'] = Hash::make('password');
        }

        return $payload;
    }
}
