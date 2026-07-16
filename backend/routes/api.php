<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AvailabilityController;
use App\Http\Controllers\Api\HealthController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/health', HealthController::class);
Route::get('/availability/template', [AvailabilityController::class, 'template']);

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);

        Route::get('/mentors/{user}/availability', [AvailabilityController::class, 'showMentor']);
    });
});

Route::middleware(['auth:sanctum', 'mentor'])->group(function () {
    Route::get('/availability', [AvailabilityController::class, 'showMine']);
    Route::put('/availability', [AvailabilityController::class, 'updateMine']);
});

Route::middleware(['auth:sanctum', 'admin'])->apiResource('users', UserController::class);
