<?php

namespace App\Http\Controllers\Api;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Appointment\StoreAppointmentRequest;
use App\Models\Appointment;
use App\Models\AreaOfExpertise;
use App\Models\MentorAvailability;
use App\Models\User;
use App\Support\SessionSlots;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AppointmentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $query = Appointment::query()
            ->with([
                'client:id,name,mobile',
                'mentor:id,name,mobile',
                'areaOfExpertise:id,slug,name,name_en',
            ])
            ->orderByDesc('date')
            ->orderBy('start_time');

        if ($user->role === UserRole::Mentor) {
            $query->where('mentor_id', $user->id);
        } elseif ($user->role === UserRole::Admin) {
            // Admins can see all appointments.
        } else {
            $query->where('client_id', $user->id);
        }

        $appointments = $query->get()->map(fn (Appointment $appointment) => $this->formatAppointment($appointment));

        return response()->json(['data' => $appointments]);
    }

    public function slots(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'area_of_expertise_id' => ['required', 'integer', 'exists:areas_of_expertise,id'],
            'date' => ['nullable', 'date', 'after_or_equal:today'],
            'mentor_id' => ['nullable', 'integer', 'exists:users,id'],
            'from' => ['nullable', 'date', 'after_or_equal:today'],
            'to' => ['nullable', 'date', 'after_or_equal:from'],
            'days' => ['nullable', 'integer', 'min:1', 'max:28'],
        ]);

        $areaId = (int) $validated['area_of_expertise_id'];
        $mentorId = isset($validated['mentor_id']) ? (int) $validated['mentor_id'] : null;

        $mentors = User::query()
            ->where('role', UserRole::Mentor)
            ->whereHas('areasOfExpertise', static function ($query) use ($areaId): void {
                $query->where('areas_of_expertise.id', $areaId);
            })
            ->when($mentorId, static fn ($query) => $query->where('id', $mentorId))
            ->orderBy('name')
            ->get(['id', 'name']);

        if ($mentors->isEmpty()) {
            return response()->json(['data' => []]);
        }

        if (isset($validated['date'])) {
            $from = Carbon::parse($validated['date'])->startOfDay();
            $to = $from->copy();
        } else {
            $from = isset($validated['from'])
                ? Carbon::parse($validated['from'])->startOfDay()
                : Carbon::today();
            $to = isset($validated['to'])
                ? Carbon::parse($validated['to'])->startOfDay()
                : $from->copy()->addDays(((int) ($validated['days'] ?? 14)) - 1);
        }

        $mentorIds = $mentors->pluck('id')->all();

        $availabilities = MentorAvailability::query()
            ->whereIn('user_id', $mentorIds)
            ->get()
            ->groupBy('user_id');

        $booked = Appointment::query()
            ->whereIn('mentor_id', $mentorIds)
            ->whereBetween('date', [$from->toDateString(), $to->toDateString()])
            ->where('status', '!=', 'cancelled')
            ->get(['mentor_id', 'date', 'start_time'])
            ->mapWithKeys(static function (Appointment $row) {
                $date = $row->date instanceof Carbon
                    ? $row->date->toDateString()
                    : (string) $row->date;

                return ["{$row->mentor_id}|{$date}|{$row->start_time}" => true];
            });

        $slots = [];
        $mentorNames = $mentors->keyBy('id');

        for ($day = $from->copy(); $day->lte($to); $day->addDay()) {
            if ($day->lt(Carbon::today())) {
                continue;
            }

            $dayOfWeek = ((int) $day->dayOfWeekIso) - 1; // 0=Mon … 6=Sun
            $dateString = $day->toDateString();
            $isToday = $day->isSameDay(Carbon::today());
            $nowHm = Carbon::now()->format('H:i');

            foreach ($mentorIds as $id) {
                $mentorSlots = $availabilities->get($id, collect());

                foreach ($mentorSlots as $availability) {
                    if ((int) $availability->day_of_week !== $dayOfWeek) {
                        continue;
                    }

                    if ($isToday && $availability->start_time <= $nowHm) {
                        continue;
                    }

                    $key = "{$id}|{$dateString}|{$availability->start_time}";

                    if (isset($booked[$key])) {
                        continue;
                    }

                    $slots[] = [
                        'mentor_id' => $id,
                        'mentor_name' => $mentorNames[$id]->name,
                        'date' => $dateString,
                        'day_of_week' => $dayOfWeek,
                        'start_time' => $availability->start_time,
                        'end_time' => $availability->end_time,
                        'area_of_expertise_id' => $areaId,
                    ];
                }
            }
        }

        usort($slots, static function (array $a, array $b): int {
            return [$a['date'], $a['start_time'], $a['mentor_name']]
                <=> [$b['date'], $b['start_time'], $b['mentor_name']];
        });

        return response()->json(['data' => $slots]);
    }

    public function store(StoreAppointmentRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();
        $data = $request->validated();

        $area = AreaOfExpertise::query()->findOrFail($data['area_of_expertise_id']);
        $mentor = User::query()
            ->where('role', UserRole::Mentor)
            ->whereKey($data['mentor_id'])
            ->firstOrFail();

        if (! $mentor->areasOfExpertise()->where('areas_of_expertise.id', $area->id)->exists()) {
            throw ValidationException::withMessages([
                'mentor_id' => ['Selected mentor does not offer this area of expertise.'],
            ]);
        }

        $date = Carbon::parse($data['date'])->startOfDay();
        $dayOfWeek = ((int) $date->dayOfWeekIso) - 1;
        $start = $data['start_time'];
        $end = SessionSlots::endTimeFor($start);

        if ($end === null) {
            throw ValidationException::withMessages([
                'start_time' => ['Invalid session start time.'],
            ]);
        }

        $available = MentorAvailability::query()
            ->where('user_id', $mentor->id)
            ->where('day_of_week', $dayOfWeek)
            ->where('start_time', $start)
            ->exists();

        if (! $available) {
            throw ValidationException::withMessages([
                'start_time' => ['Mentor is not available at this time.'],
            ]);
        }

        $taken = Appointment::query()
            ->where('mentor_id', $mentor->id)
            ->whereDate('date', $date->toDateString())
            ->where('start_time', $start)
            ->where('status', '!=', 'cancelled')
            ->exists();

        if ($taken) {
            throw ValidationException::withMessages([
                'start_time' => ['This slot is already booked.'],
            ]);
        }

        $appointment = DB::transaction(function () use ($user, $mentor, $area, $date, $start, $end, $data) {
            return Appointment::query()->create([
                'client_id' => $user->id,
                'mentor_id' => $mentor->id,
                'area_of_expertise_id' => $area->id,
                'date' => $date->toDateString(),
                'start_time' => $start,
                'end_time' => $end,
                'status' => 'confirmed',
                'notes' => $data['notes'] ?? null,
            ]);
        });

        $appointment->load([
            'client:id,name,mobile',
            'mentor:id,name,mobile',
            'areaOfExpertise:id,slug,name,name_en',
        ]);

        return response()->json([
            'data' => $this->formatAppointment($appointment),
        ], 201);
    }

    public function destroy(Request $request, Appointment $appointment): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $canCancel = $user->role === UserRole::Admin
            || $appointment->client_id === $user->id
            || $appointment->mentor_id === $user->id;

        if (! $canCancel) {
            abort(403);
        }

        $appointment->update(['status' => 'cancelled']);

        $appointment->load([
            'client:id,name,mobile',
            'mentor:id,name,mobile',
            'areaOfExpertise:id,slug,name,name_en',
        ]);

        return response()->json([
            'data' => $this->formatAppointment($appointment),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function formatAppointment(Appointment $appointment): array
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
            'notes' => $appointment->notes,
            'client' => $appointment->client
                ? [
                    'id' => $appointment->client->id,
                    'name' => $appointment->client->name,
                    'mobile' => $appointment->client->mobile,
                ]
                : null,
            'mentor' => $appointment->mentor
                ? [
                    'id' => $appointment->mentor->id,
                    'name' => $appointment->mentor->name,
                    'mobile' => $appointment->mentor->mobile,
                ]
                : null,
            'area_of_expertise' => $appointment->areaOfExpertise
                ? [
                    'id' => $appointment->areaOfExpertise->id,
                    'slug' => $appointment->areaOfExpertise->slug,
                    'name' => $appointment->areaOfExpertise->name,
                    'name_en' => $appointment->areaOfExpertise->name_en,
                ]
                : null,
        ];
    }
}
