<?php

namespace Modules\Auth\Http\Controllers;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use Modules\Auth\Http\Requests\LoginRequest;
use Modules\Auth\Http\Requests\RegisterRequest;
use Modules\User\Http\Resources\UserResource;
use Modules\User\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = User::query()->create([
            'name' => $validated['name'],
            'mobile' => $validated['mobile'],
            'password' => $validated['password'],
            'role' => $validated['role'] ?? UserRole::User->value,
        ]);

        $token = $user->createToken('api')->plainTextToken;

        return response()->json([
            'data' => [
                'user' => new UserResource($user),
                'token' => $token,
            ],
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = User::query()->where('mobile', $validated['mobile'])->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'mobile' => [__('auth.failed')],
            ]);
        }

        $token = $user->createToken('api')->plainTextToken;

        return response()->json([
            'data' => [
                'user' => new UserResource($user),
                'token' => $token,
            ],
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'data' => new UserResource($request->user()),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()?->currentAccessToken()?->delete();

        return response()->json(null, 204);
    }
}
