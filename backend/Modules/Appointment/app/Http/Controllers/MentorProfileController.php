<?php

namespace Modules\Appointment\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\Appointment\Models\Appointment;
use Modules\Appointment\Models\AppointmentRating;
use Modules\User\Models\User;
use App\Support\SessionSlots;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MentorProfileController extends Controller
{
    public function mine(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        return response()->json([
            'data' => $this->buildProfile($user),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function buildProfile(User $mentor): array
    {
        $appointments = Appointment::query()
            ->where('mentor_id', $mentor->id)
            ->with([
                'client:id,name,mobile',
                'areaOfExpertise:id,slug,name,name_en',
                'rating',
            ])
            ->orderByDesc('date')
            ->orderByDesc('start_time')
            ->get();

        $completed = $appointments->filter(
            static fn (Appointment $row) => $row->isCompleted(),
        );
        $upcoming = $appointments->filter(
            static fn (Appointment $row) => $row->status === 'confirmed' && ! $row->isPast(),
        );
        $cancelled = $appointments->where('status', 'cancelled');

        $ratingAvg = AppointmentRating::query()
            ->where('mentor_id', $mentor->id)
            ->avg('score');
        $ratingCount = AppointmentRating::query()
            ->where('mentor_id', $mentor->id)
            ->count();

        $expertise = $mentor->areasOfExpertise()
            ->orderBy('sort_order')
            ->get(['areas_of_expertise.id', 'slug', 'name', 'name_en'])
            ->map(static fn ($area) => [
                'id' => $area->id,
                'slug' => $area->slug,
                'name' => $area->name,
                'name_en' => $area->name_en,
            ])
            ->values()
            ->all();

        $availability = $mentor->availabilities()
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get(['day_of_week', 'start_time', 'end_time'])
            ->map(static fn ($row) => [
                'day_of_week' => (int) $row->day_of_week,
                'start_time' => $row->start_time,
                'end_time' => $row->end_time,
            ])
            ->values()
            ->all();

        $meetingsByExpertise = $completed
            ->groupBy(static fn (Appointment $row) => $row->area_of_expertise_id)
            ->map(static function ($group, $areaId) {
                /** @var Appointment $first */
                $first = $group->first();

                return [
                    'area_of_expertise_id' => (int) $areaId,
                    'name' => $first->areaOfExpertise?->name ?? '—',
                    'name_en' => $first->areaOfExpertise?->name_en,
                    'meetings_done' => $group->count(),
                ];
            })
            ->values()
            ->all();

        return [
            'mentor' => [
                'id' => $mentor->id,
                'name' => $mentor->name,
                'mobile' => $mentor->mobile,
                'email' => $mentor->email,
            ],
            'stats' => [
                'meetings_done' => $completed->count(),
                'meetings_upcoming' => $upcoming->count(),
                'meetings_cancelled' => $cancelled->count(),
                'rating_average' => $ratingAvg !== null ? round((float) $ratingAvg, 1) : null,
                'rating_count' => $ratingCount,
            ],
            'expertise' => $expertise,
            'meetings_by_expertise' => $meetingsByExpertise,
            'availability' => $availability,
            'template_slots' => SessionSlots::all(),
            'recent_meetings' => $appointments
                ->take(20)
                ->map(fn (Appointment $appointment) => $this->formatMeeting($appointment))
                ->values()
                ->all(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function formatMeeting(Appointment $appointment): array
    {
        $date = $appointment->date instanceof Carbon
            ? $appointment->date->toDateString()
            : (string) $appointment->date;

        return [
            'id' => $appointment->id,
            'date' => $date,
            'start_time' => $appointment->start_time,
            'end_time' => $appointment->end_time,
            'status' => $appointment->status,
            'is_completed' => $appointment->isCompleted(),
            'is_in_session' => $appointment->isInSessionWindow(),
            'can_join_meeting' => $appointment->canJoinMeeting(),
            'meeting_url' => $appointment->meeting_url,
            'client' => $appointment->client
                ? [
                    'id' => $appointment->client->id,
                    'name' => $appointment->client->name,
                ]
                : null,
            'area_of_expertise' => $appointment->areaOfExpertise
                ? [
                    'id' => $appointment->areaOfExpertise->id,
                    'name' => $appointment->areaOfExpertise->name,
                    'name_en' => $appointment->areaOfExpertise->name_en,
                ]
                : null,
            'rating' => $appointment->rating
                ? [
                    'score' => (int) $appointment->rating->score,
                    'comment' => $appointment->rating->comment,
                ]
                : null,
        ];
    }
}
