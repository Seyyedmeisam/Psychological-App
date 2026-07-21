<?php

use App\Http\Controllers\Api\HealthController;
use Illuminate\Support\Facades\Route;

// Feature routes live in Modules/*/routes/api.php (nwidart/laravel-modules).
// Keep only shell / platform endpoints here.

Route::get('/health', HealthController::class);
