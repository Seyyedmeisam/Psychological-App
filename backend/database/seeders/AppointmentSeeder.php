<?php

namespace Database\Seeders;

use App\Enums\AppointmentStatus;
use App\Enums\MentorVerificationStatus;
use App\Enums\UserRole;
use App\Support\SessionSlots;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Modules\Appointment\Models\Appointment;
use Modules\Appointment\Models\AppointmentRating;
use Modules\Appointment\Models\MentorAvailability;
use Modules\User\Models\User;

class AppointmentSeeder extends Seeder
{
    public function run(): void
    {
        $mentors = User::query()
            ->where('role', UserRole::Mentor)
            ->where('mentor_verification_status', MentorVerificationStatus::Approved)
            ->with('areasOfExpertise')
            ->orderBy('id')
            ->get()
            ->filter(fn (User $user) => $user->areasOfExpertise->isNotEmpty())
            ->values();

        $clients = User::query()
            ->where('role', UserRole::User)
            ->orderBy('id')
            ->get();

        if ($mentors->isEmpty() || $clients->isEmpty()) {
            return;
        }

        AppointmentRating::query()->delete();
        Appointment::query()->delete();

        $slots = SessionSlots::all();
        $availability = MentorAvailability::query()
            ->whereIn('user_id', $mentors->pluck('id'))
            ->get()
            ->groupBy('user_id');

        $occupied = [];
        $rows = [];
        $now = Carbon::now();

        $notes = [
            'First session — goals and history.',
            'Follow-up on sleep and worry loops.',
            'Discussed communication patterns at home.',
            'Client asked for coping tools before exams.',
            null,
            null,
            'Short check-in after last homework.',
        ];

        $ratingComments = [
            'Calm, clear, and very helpful.',
            'Felt understood and supported.',
            'Practical tools I can use every day.',
            'Great listener and structured guidance.',
            'Helpful session; looking forward to the next one.',
            'Clear explanations and useful homework.',
        ];

        // Dense history: past 55 days + next 18 days
        for ($offset = -55; $offset <= 18; $offset++) {
            $date = Carbon::today()->addDays($offset);
            $dayOfWeek = ((int) $date->dayOfWeekIso) - 1; // Mon=0 … Sun=6

            foreach ($mentors as $mentorIndex => $mentor) {
                $mentorSlots = $availability->get($mentor->id, collect())
                    ->where('day_of_week', $dayOfWeek)
                    ->values();

                if ($mentorSlots->isEmpty()) {
                    continue;
                }

                // Book denser near today for dashboards
                $density = abs($offset) <= 7 ? 0.55 : (abs($offset) <= 21 ? 0.35 : 0.22);
                $seed = crc32($mentor->id.'|'.$date->toDateString());
                if (($seed % 100) / 100 >= $density) {
                    continue;
                }

                $pickCount = 1 + ($seed % 2);
                $picked = $mentorSlots
                    ->sortBy(fn ($slot) => crc32($seed.'|'.$slot->start_time))
                    ->take($pickCount)
                    ->values();

                foreach ($picked as $slotIndex => $avail) {
                    $key = $mentor->id.'|'.$date->toDateString().'|'.$avail->start_time;
                    if (isset($occupied[$key])) {
                        continue;
                    }

                    $client = $clients[($seed + $slotIndex + $mentorIndex) % $clients->count()];
                    $area = $mentor->areasOfExpertise[($seed + $slotIndex) % $mentor->areasOfExpertise->count()];

                    $status = $this->pickStatus($offset, $seed + $slotIndex);
                    $occupied[$key] = true;

                    $createdAt = $now->copy()->subDays(max(0, -$offset))->addMinutes($slotIndex);

                    $rows[] = [
                        'client_id' => $client->id,
                        'mentor_id' => $mentor->id,
                        'area_of_expertise_id' => $area->id,
                        'date' => $date->toDateString(),
                        'start_time' => $avail->start_time,
                        'end_time' => $avail->end_time,
                        'status' => $status,
                        'notes' => $notes[($seed + $slotIndex) % count($notes)],
                        'created_at' => $createdAt->toDateTimeString(),
                        'updated_at' => $now->toDateTimeString(),
                    ];
                }
            }
        }

        // Guarantee a live/today session for demo mentor + Maryam when a slot fits
        $reza = $mentors->firstWhere('mobile', '09121111111') ?? $mentors->first();
        $maryam = $clients->firstWhere('mobile', '09122222222') ?? $clients->first();
        foreach ($slots as $slot) {
            $start = Carbon::parse(Carbon::today()->toDateString().' '.$slot['start']);
            $end = Carbon::parse(Carbon::today()->toDateString().' '.$slot['end']);
            if (! $now->between($start, $end)) {
                continue;
            }

            $key = $reza->id.'|'.Carbon::today()->toDateString().'|'.$slot['start'];
            if (isset($occupied[$key])) {
                break;
            }

            $area = $reza->areasOfExpertise->first();
            if (! $area) {
                break;
            }

            $rows[] = [
                'client_id' => $maryam->id,
                'mentor_id' => $reza->id,
                'area_of_expertise_id' => $area->id,
                'date' => Carbon::today()->toDateString(),
                'start_time' => $slot['start'],
                'end_time' => $slot['end'],
                'status' => AppointmentStatus::Confirmed->value,
                'notes' => 'Live demo session window.',
                'created_at' => $now->toDateTimeString(),
                'updated_at' => $now->toDateTimeString(),
            ];
            break;
        }

        foreach (array_chunk($rows, 200) as $chunk) {
            Appointment::query()->insert($chunk);
        }

        $pastConfirmed = Appointment::query()
            ->where('status', AppointmentStatus::Confirmed->value)
            ->whereDate('date', '<', Carbon::today()->toDateString())
            ->orderBy('id')
            ->get();

        $ratingRows = [];
        foreach ($pastConfirmed as $index => $appointment) {
            if ($index % 5 === 0) {
                continue;
            }

            $ratingRows[] = [
                'appointment_id' => $appointment->id,
                'client_id' => $appointment->client_id,
                'mentor_id' => $appointment->mentor_id,
                'score' => 3 + ($index % 3),
                'comment' => $ratingComments[$index % count($ratingComments)],
                'created_at' => $now->toDateTimeString(),
                'updated_at' => $now->toDateTimeString(),
            ];
        }

        foreach (array_chunk($ratingRows, 200) as $chunk) {
            AppointmentRating::query()->insert($chunk);
        }
    }

    private function pickStatus(int $dayOffset, int $seed): string
    {
        $roll = $seed % 20;

        if ($dayOffset > 0) {
            return $roll === 0
                ? AppointmentStatus::Cancelled->value
                : AppointmentStatus::Confirmed->value;
        }

        return match (true) {
            $roll === 0 => AppointmentStatus::Cancelled->value,
            $roll === 1 => AppointmentStatus::UserAbsent->value,
            $roll === 2 => AppointmentStatus::MentorAbsent->value,
            default => AppointmentStatus::Confirmed->value,
        };
    }
}
