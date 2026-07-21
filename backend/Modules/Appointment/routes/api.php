<?php

use Illuminate\Support\Facades\Route;
use Modules\Appointment\Http\Controllers\AdminStatsController;
use Modules\Appointment\Http\Controllers\AppointmentController;
use Modules\Appointment\Http\Controllers\AreaOfExpertiseController;
use Modules\Appointment\Http\Controllers\AvailabilityController;
use Modules\Appointment\Http\Controllers\MentorProfileController;

Route::get('/availability/template', [AvailabilityController::class, 'template']);

Route::middleware(['auth:sanctum', 'mentor'])->group(function () {
    Route::get('/availability', [AvailabilityController::class, 'showMine']);
    Route::put('/availability', [AvailabilityController::class, 'updateMine']);
    Route::get('/mentor/expertise', [AreaOfExpertiseController::class, 'showMine']);
    Route::put('/mentor/expertise', [AreaOfExpertiseController::class, 'updateMine']);
    Route::get('/mentor/profile', [MentorProfileController::class, 'mine']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/areas-of-expertise', [AreaOfExpertiseController::class, 'index']);
    Route::get('/areas-of-expertise/{areaOfExpertise}/mentors', [AreaOfExpertiseController::class, 'mentorsForArea']);

    Route::get('/appointments', [AppointmentController::class, 'index']);
    Route::get('/appointments/slots', [AppointmentController::class, 'slots']);
    Route::post('/appointments', [AppointmentController::class, 'store']);
    Route::post('/appointments/{appointment}/meeting/join', [AppointmentController::class, 'joinMeeting']);
    Route::post('/appointments/{appointment}/rating', [AppointmentController::class, 'rate']);
    Route::patch('/appointments/{appointment}/status', [AppointmentController::class, 'updateStatus']);
    Route::delete('/appointments/{appointment}', [AppointmentController::class, 'destroy']);
});

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/admin/stats', AdminStatsController::class);
});