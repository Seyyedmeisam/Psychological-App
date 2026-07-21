<?php

use Illuminate\Support\Facades\Route;
use Modules\Auth\Http\Controllers\AuthController;
use Modules\Appointment\Http\Controllers\AvailabilityController;

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::put('/me', [AuthController::class, 'updateProfile']);
        Route::post('/me/avatar', [AuthController::class, 'updateAvatar']);
        Route::post('/logout', [AuthController::class, 'logout']);

        Route::get('/mentors/{user}/availability', [AvailabilityController::class, 'showMentor']);
    });
});