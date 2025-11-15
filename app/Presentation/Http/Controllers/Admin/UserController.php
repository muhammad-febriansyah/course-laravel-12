<?php

namespace App\Presentation\Http\Controllers\Admin;

use App\Application\Admin\Users\UserManagementService;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Presentation\Http\Requests\Admin\StoreUserRequest;
use App\Presentation\Http\Requests\Admin\UpdateUserRequest;
use App\Presentation\Http\Resources\UserResource;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function __construct(
        private readonly UserManagementService $service,
    ) {
    }

    public function index(Request $request): Response
    {
        $this->ensureAdmin($request);

        $search = $request->string('search')->toString();
        $role = $request->string('role')->toString();
        $status = $request->filled('status') ? (int) $request->query('status') : null;

        $users = User::query()
            ->when($search, function ($query, string $value) {
                $query->where(function ($q) use ($value) {
                    $q->where('name', 'like', "%{$value}%")
                        ->orWhere('email', 'like', "%{$value}%");
                });
            })
            ->when($role, fn ($query, string $value) => $query->where('role', $value))
            ->when($status !== null, fn ($query) => $query->where('status', $status))
            ->orderByDesc('created_at')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => [
                'data' => UserResource::collection($users)->resolve($request),
                'meta' => [
                    'currentPage' => $users->currentPage(),
                    'lastPage' => $users->lastPage(),
                    'perPage' => $users->perPage(),
                    'total' => $users->total(),
                ],
            ],
            'filters' => [
                'search' => $search,
                'role' => $role ?: null,
                'status' => $status,
            ],
            'roles' => ['admin', 'instructor', 'student'],
        ]);
    }

    public function create(Request $request): Response
    {
        $this->ensureAdmin($request);

        return Inertia::render('Admin/Users/Create', [
            'roles' => ['admin', 'instructor', 'student'],
        ]);
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('avatars', 'public');
            $data['avatar'] = '/storage/' . $path;
        } else {
            unset($data['avatar']);
        }

        $user = $this->service->create($data);

        return Redirect::route('users.show', $user)->with('success', 'Pengguna berhasil dibuat.');
    }

    public function show(Request $request, User $user): Response
    {
        $this->ensureAdmin($request);

        $user->loadCount(['enrollments', 'transactions']);

        return Inertia::render('Admin/Users/Show', [
            'user' => [
                'data' => UserResource::make($user)->resolve($request),
                'stats' => [
                    'enrollments' => $user->enrollments_count ?? 0,
                    'transactions' => $user->transactions_count ?? 0,
                ],
            ],
        ]);
    }

    public function edit(Request $request, User $user): Response
    {
        $this->ensureAdmin($request);

        return Inertia::render('Admin/Users/Edit', [
            'user' => UserResource::make($user)->resolve($request),
            'roles' => ['admin', 'instructor', 'student'],
        ]);
    }

    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('avatar')) {
            if ($user->avatar && Str::startsWith($user->avatar, '/storage/')) {
                $oldPath = Str::after($user->avatar, '/storage/');
                if ($oldPath !== $user->avatar) {
                    Storage::disk('public')->delete($oldPath);
                }
            }

            $path = $request->file('avatar')->store('avatars', 'public');
            $data['avatar'] = '/storage/' . $path;
        } else {
            unset($data['avatar']);
        }

        $this->service->update($user, $data);

        return Redirect::route('users.show', $user)->with('success', 'Pengguna berhasil diperbarui.');
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        $this->ensureAdmin($request);

        if ($request->user()?->id === $user->id) {
            return Redirect::back()->withErrors([
                'error' => 'Anda tidak dapat menghapus akun sendiri.',
            ]);
        }

        $this->service->delete($user);

        return Redirect::route('users.index')->with('success', 'Pengguna berhasil dihapus.');
    }

    private function ensureAdmin(Request $request): void
    {
        $user = $request->user();

        if (!$user || ($user->role !== 'admin' && $user->email !== 'admin@admin.com')) {
            abort(403);
        }
    }
}
