<?php

namespace Modules\Appointment\Services;

use App\Enums\AppointmentStatus;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Modules\Appointment\Models\Appointment;
use Modules\Appointment\Models\AppointmentRating;
use Modules\User\Models\User;

class AdminStatsService
{
    private const TREND_DAYS = 14;

    /**
     * @return array<string, mixed>
     */
    public function summary(): array
    {
        $now = now();
        $today = $now->toDateString();
        $time = $now->format('H:i');

        $confirmed = Appointment::query()->where('status', AppointmentStatus::Confirmed->value);
        $cancelled = Appointment::query()->where('status', AppointmentStatus::Cancelled->value);

        $upcoming = Appointment::query()
            ->where('status', AppointmentStatus::Confirmed->value)
            ->where(function ($query) use ($today, $time): void {
                $query
                    ->whereDate('date', '>', $today)
                    ->orWhere(function ($inner) use ($today, $time): void {
                        $inner
                            ->whereDate('date', $today)
                            ->where('end_time', '>', $time);
                    });
            })
            ->count();

        $completed = Appointment::query()
            ->where('status', AppointmentStatus::Confirmed->value)
            ->where(function ($query) use ($today, $time): void {
                $query
                    ->whereDate('date', '<', $today)
                    ->orWhere(function ($inner) use ($today, $time): void {
                        $inner
                            ->whereDate('date', $today)
                            ->where('end_time', '<=', $time);
                    });
            })
            ->count();

        $ratingAvg = AppointmentRating::query()->avg('score');
        $ratingCount = AppointmentRating::query()->count();

        $clients = User::query()->where('role', 'user')->count();
        $mentors = User::query()->where('role', 'mentor')->count();
        $admins = User::query()->where('role', 'admin')->count();

        $clientsBooked = Appointment::query()
            ->select('client_id')
            ->distinct()
            ->count('client_id');

        return [
            'clients_total' => $clients,
            'mentors_total' => $mentors,
            'admins_total' => $admins,
            'users_total' => $clients + $mentors + $admins,
            'clients_booked' => $clientsBooked,
            'appointments_total' => Appointment::query()->count(),
            'meetings_confirmed' => (clone $confirmed)->count(),
            'meetings_cancelled' => (clone $cancelled)->count(),
            'meetings_user_absent' => Appointment::query()
                ->where('status', AppointmentStatus::UserAbsent->value)
                ->count(),
            'meetings_mentor_absent' => Appointment::query()
                ->where('status', AppointmentStatus::MentorAbsent->value)
                ->count(),
            'meetings_upcoming' => $upcoming,
            'meetings_completed' => $completed,
            'rating_average' => $ratingAvg !== null ? round((float) $ratingAvg, 1) : null,
            'rating_count' => $ratingCount,
            'conversations_total' => $this->safeCount('conversations'),
            'messages_total' => $this->safeCount('messages'),
            'messages_today' => $this->safeCountToday('messages'),
            'appointments_by_status' => $this->appointmentsByStatus(),
            'appointments_trend' => $this->appointmentsTrend(),
            'rating_distribution' => $this->ratingDistribution(),
            'top_mentors' => $this->topMentors(),
            'recent_appointments' => $this->recentAppointments(),
        ];
    }

    /**
     * @return list<array{status: string, count: int}>
     */
    private function appointmentsByStatus(): array
    {
        $counts = Appointment::query()
            ->select('status', DB::raw('count(*) as aggregate'))
            ->groupBy('status')
            ->pluck('aggregate', 'status');

        $rows = [];
        foreach (AppointmentStatus::cases() as $status) {
            $rows[] = [
                'status' => $status->value,
                'count' => (int) ($counts[$status->value] ?? 0),
            ];
        }

        return $rows;
    }

    /**
     * @return list<array{date: string, count: int}>
     */
    private function appointmentsTrend(): array
    {
        $start = Carbon::today()->subDays(self::TREND_DAYS - 1);
        $raw = Appointment::query()
            ->select('date', DB::raw('count(*) as aggregate'))
            ->whereDate('date', '>=', $start->toDateString())
            ->whereDate('date', '<=', Carbon::today()->toDateString())
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->mapWithKeys(static function ($row): array {
                $key = $row->date instanceof Carbon
                    ? $row->date->toDateString()
                    : Carbon::parse((string) $row->date)->toDateString();

                return [$key => (int) $row->aggregate];
            });

        $rows = [];
        for ($i = 0; $i < self::TREND_DAYS; $i++) {
            $day = $start->copy()->addDays($i);
            $key = $day->toDateString();
            $rows[] = [
                'date' => $key,
                'count' => (int) ($raw[$key] ?? 0),
            ];
        }

        return $rows;
    }

    /**
     * @return list<array{score: int, count: int}>
     */
    private function ratingDistribution(): array
    {
        $counts = AppointmentRating::query()
            ->select('score', DB::raw('count(*) as aggregate'))
            ->groupBy('score')
            ->pluck('aggregate', 'score');

        $rows = [];
        for ($score = 1; $score <= 5; $score++) {
            $rows[] = [
                'score' => $score,
                'count' => (int) ($counts[$score] ?? 0),
            ];
        }

        return $rows;
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function topMentors(): array
    {
        return User::query()
            ->where('role', 'mentor')
            ->withCount([
                'mentorAppointments as meetings_count',
            ])
            ->withAvg('receivedRatings as rating_average', 'score')
            ->withCount('receivedRatings as rating_count')
            ->orderByDesc('meetings_count')
            ->orderByDesc('rating_average')
            ->limit(5)
            ->get()
            ->map(static function (User $mentor): array {
                return [
                    'id' => $mentor->id,
                    'name' => $mentor->name,
                    'avatar' => $mentor->avatar,
                    'meetings_count' => (int) $mentor->meetings_count,
                    'rating_average' => $mentor->rating_average !== null
                        ? round((float) $mentor->rating_average, 1)
                        : null,
                    'rating_count' => (int) $mentor->rating_count,
                ];
            })
            ->values()
            ->all();
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function recentAppointments(): array
    {
        return Appointment::query()
            ->with([
                'client:id,name',
                'mentor:id,name',
                'areaOfExpertise:id,name',
            ])
            ->orderByDesc('date')
            ->orderByDesc('start_time')
            ->limit(8)
            ->get()
            ->map(static function (Appointment $appointment): array {
                return [
                    'id' => $appointment->id,
                    'date' => $appointment->date instanceof Carbon
                        ? $appointment->date->toDateString()
                        : (string) $appointment->date,
                    'start_time' => substr((string) $appointment->start_time, 0, 5),
                    'end_time' => substr((string) $appointment->end_time, 0, 5),
                    'status' => $appointment->status,
                    'is_completed' => $appointment->isCompleted(),
                    'client' => [
                        'id' => $appointment->client?->id,
                        'name' => $appointment->client?->name,
                    ],
                    'mentor' => [
                        'id' => $appointment->mentor?->id,
                        'name' => $appointment->mentor?->name,
                    ],
                    'area_of_expertise' => $appointment->areaOfExpertise
                        ? [
                            'id' => $appointment->areaOfExpertise->id,
                            'name' => $appointment->areaOfExpertise->name,
                        ]
                        : null,
                ];
            })
            ->values()
            ->all();
    }

    private function safeCount(string $table): int
    {
        if (! Schema::hasTable($table)) {
            return 0;
        }

        return (int) DB::table($table)->count();
    }

    private function safeCountToday(string $table): int
    {
        if (! Schema::hasTable($table)) {
            return 0;
        }

        return (int) DB::table($table)
            ->whereDate('created_at', Carbon::today()->toDateString())
            ->count();
    }
}
