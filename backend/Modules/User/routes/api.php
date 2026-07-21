<?php

use Illuminate\Support\Facades\Route;
use Modules\User\Http\Controllers\UserController;

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::post('users/{user}/avatar', [UserController::class, 'updateAvatar']);
    Route::apiResource('users', UserController::class);
});
