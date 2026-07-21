<?php

namespace Modules\Appointment\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\Appointment\Models\Appointment;
use Modules\Appointment\Models\AppointmentRating;
use Modules\User\Models\User;
use Illuminate\Http\JsonResponse;

class AdminStatsController extends Controller
{
    public function __invoke(): JsonResponse
    {
        $confirmed = Appointment::query()->where('status', 'confirmed');
        $cancelled = Appointment::query()->where('status', 'cancelled');

        $clientsBooked = Appointment::query()
            ->select('client_id')
            ->distinct()
            ->count('client_id');

        $upcoming = Appointment::query()
            ->where('status', 'confirmed')
            ->where(function ($query): void {
                $query
                    ->whereDate('date', '>', now()->toDateString())
                    ->orWhere(function ($inner): void {
                        $inner
                            ->whereDate('date', now()->toDateString())
                            ->where('end_time', '>', now()->format('H:i'));
                    });
            })
            ->count();

        $completed = Appointment::query()
            ->where('status', 'confirmed')
            ->where(function ($query): void {
                $query
                    ->whereDate('date', '<', now()->toDateString())
                    ->orWhere(function ($inner): void {
                        $inner
                            ->whereDate('date', now()->toDateString())
                            ->where('end_time', '<=', now()->format('H:i'));
                    });
            })
            ->count();

        $ratingAvg = AppointmentRating::query()->avg('score');
        $ratingCount = AppointmentRating::query()->count();

        $mentors = User::query()
            ->where('role', 'mentor')
            ->count();

        $clients = User::query()
            ->where('role', 'user')
            ->count();

        return response()->json([
            'data' => [
                'clients_total' => $clients,
                'mentors_total' => $mentors,
                'clients_booked' => $clientsBooked,
                'meetings_confirmed' => (clone $confirmed)->count(),
                'meetings_cancelled' => (clone $cancelled)->count(),
                'meetings_upcoming' => $upcoming,
                'meetings_completed' => $completed,
                'rating_average' => $ratingAvg !== null ? round((float) $ratingAvg, 1) : null,
                'rating_count' => $ratingCount,
            ],
        ]);
    }
}
