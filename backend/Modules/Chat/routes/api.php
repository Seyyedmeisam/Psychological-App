<?php

use Illuminate\Support\Facades\Route;
use Modules\Chat\Http\Controllers\ChatController;

Route::middleware('auth:sanctum')->prefix('chats')->group(function () {
    Route::get('/', [ChatController::class, 'index']);
    Route::get('/people', [ChatController::class, 'people']);
    Route::post('/', [ChatController::class, 'store']);
    Route::get('/{conversation}/messages', [ChatController::class, 'messages']);
    Route::post('/{conversation}/messages', [ChatController::class, 'send']);
});
