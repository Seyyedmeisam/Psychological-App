<?php

namespace Modules\User\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Modules\User\Http\Requests\StoreUserRequest;
use Modules\User\Http\Requests\UpdateUserAvatarRequest;
use Modules\User\Http\Requests\UpdateUserRequest;
use Modules\User\Http\Resources\UserResource;
use Modules\User\Models\User;

class UserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = User::query()->latest();

        if ($search = $request->string('search')->toString()) {
            $query->where(function ($builder) use ($search) {
                $builder
                    ->where('name', 'like', "%{$search}%")
                    ->orWhere('mobile', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($role = $request->string('role')->toString()) {
            $query->where('role', $role);
        }

        $perPage = min(100, max(1, (int) $request->input('per_page', 15)));

        return UserResource::collection($query->paginate($perPage))->response();
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        $validated = $request->validated();

        if (($validated['role'] ?? null) === \App\Enums\UserRole::Mentor->value) {
            $validated['mentor_verification_status'] = \App\Enums\MentorVerificationStatus::Pending->value;
        }

        $user = User::query()->create($validated);

        return response()->json(['data' => new UserResource($user)], 201);
    }

    public function show(User $user): JsonResponse
    {
        return response()->json(['data' => new UserResource($user)]);
    }

    public function update(UpdateUserRequest $request, User $user): JsonResponse
    {
        $validated = $request->validated();

        if (empty($validated['password'])) {
            unset($validated['password']);
        }

        $user->update($validated);

        return response()->json(['data' => new UserResource($user->fresh())]);
    }

    public function updateAvatar(UpdateUserAvatarRequest $request, User $user): JsonResponse
    {
        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
        }

        $path = $request->file('avatar')->store('avatars', 'public');
        $user->update(['avatar' => $path]);

        return response()->json(['data' => new UserResource($user->fresh())]);
    }

    public function destroy(User $user): JsonResponse
    {
        $user->delete();

        return response()->json(null, 204);
    }
}
