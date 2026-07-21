<?php

use Illuminate\Support\Facades\Route;
use Modules\Appointment\Http\Controllers\AdminStatsController;
use Modules\Appointment\Http\Controllers\AppointmentController;
use Modules\Appointment\Http\Controllers\AreaOfExpertiseController;
use Modules\Appointment\Http\Controllers\AvailabilityController;
use Modules\Appointment\Http\Controllers\MentorProfileController;
use Modules\Appointment\Http\Controllers\MentorVerificationController;

Route::get('/availability/template', [AvailabilityController::class, 'template']);

Route::middleware(['auth:sanctum', 'mentor'])->group(function () {
    Route::get('/mentor/verification', [MentorVerificationController::class, 'showMine']);
    Route::post('/mentor/verification/evidence', [MentorVerificationController::class, 'storeEvidence']);
    Route::delete('/mentor/verification/evidence/{evidence}', [MentorVerificationController::class, 'destroyEvidence']);
    Route::get('/mentor/profile', [MentorProfileController::class, 'mine']);
    // Expertise can be chosen while pending so admin sees intended areas.
    Route::get('/mentor/expertise', [AreaOfExpertiseController::class, 'showMine']);
    Route::put('/mentor/expertise', [AreaOfExpertiseController::class, 'updateMine']);
});

Route::middleware(['auth:sanctum', 'mentor', 'mentor.approved'])->group(function () {
    Route::get('/availability', [AvailabilityController::class, 'showMine']);
    Route::put('/availability', [AvailabilityController::class, 'updateMine']);
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
    Route::get('/admin/mentor-verifications', [MentorVerificationController::class, 'adminIndex']);
    Route::post('/admin/mentor-verifications/{user}/approve', [MentorVerificationController::class, 'approve']);
    Route::post('/admin/mentor-verifications/{user}/reject', [MentorVerificationController::class, 'reject']);
});
