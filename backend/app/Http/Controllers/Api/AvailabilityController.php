<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Availability\UpdateAvailabilityRequest;
use App\Models\MentorAvailability;
use App\Models\User;
use App\Support\SessionSlots;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AvailabilityController extends Controller
{
    public function template(): JsonResponse
    {
        return response()->json([
            'data' => [
                'day_start' => config('sessions.day_start'),
                'day_end' => config('sessions.day_end'),
                'session_minutes' => config('sessions.session_minutes'),
                'break_minutes' => config('sessions.break_minutes'),
                'slots' => SessionSlots::all(),
            ],
        ]);
    }

    public function showMine(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        return response()->json([
            'data' => $this->formatWeek($user),
        ]);
    }

    public function updateMine(UpdateAvailabilityRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();
        $slots = $request->validated('slots');

        DB::transaction(function () use ($user, $slots): void {
            MentorAvailability::query()->where('user_id', $user->id)->delete();

            $rows = [];
            foreach ($slots as $slot) {
                $start = $slot['start_time'];
                $end = SessionSlots::endTimeFor($start);

                if ($end === null) {
                    continue;
                }

                $rows[] = [
                    'user_id' => $user->id,
                    'day_of_week' => (int) $slot['day_of_week'],
                    'start_time' => $start,
                    'end_time' => $end,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            if ($rows !== []) {
                MentorAvailability::query()->insert($rows);
            }
        });

        return response()->json([
            'data' => $this->formatWeek($user->fresh()),
        ]);
    }

    public function showMentor(User $user): JsonResponse
    {
        return response()->json([
            'data' => $this->formatWeek($user),
        ]);
    }

    /**
     * @return array{
     *   mentor_id: int,
     *   template_slots: list<array{start: string, end: string}>,
     *   slots: list<array{day_of_week: int, start_time: string, end_time: string}>
     * }
     */
    private function formatWeek(User $user): array
    {
        $slots = MentorAvailability::query()
            ->where('user_id', $user->id)
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get(['day_of_week', 'start_time', 'end_time'])
            ->map(static fn (MentorAvailability $row) => [
                'day_of_week' => (int) $row->day_of_week,
                'start_time' => $row->start_time,
                'end_time' => $row->end_time,
            ])
            ->values()
            ->all();

        return [
            'mentor_id' => $user->id,
            'template_slots' => SessionSlots::all(),
            'slots' => $slots,
        ];
    }
}
