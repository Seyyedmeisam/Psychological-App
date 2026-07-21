<?php

namespace Database\Seeders;

use App\Enums\MentorVerificationStatus;
use App\Enums\UserRole;
use App\Support\SessionSlots;
use Illuminate\Database\Seeder;
use Modules\Appointment\Models\MentorAvailability;
use Modules\User\Models\User;

class MentorAvailabilitySeeder extends Seeder
{
    public function run(): void
    {
        $mentors = User::query()
            ->where('role', UserRole::Mentor)
            ->where('mentor_verification_status', MentorVerificationStatus::Approved)
            ->orderBy('id')
            ->get();

        if ($mentors->isEmpty()) {
            return;
        }

        $allStarts = SessionSlots::startTimes();
        MentorAvailability::query()
            ->whereIn('user_id', $mentors->pluck('id'))
            ->delete();

        $rows = [];
        foreach ($mentors as $index => $mentor) {
            $dayOffset = $index % 2;
            $days = $dayOffset === 0
                ? [0, 1, 2, 3, 4]
                : [1, 2, 3, 4, 5];

            $starts = match ($index % 3) {
                0 => $allStarts,
                1 => array_slice($allStarts, 1),
                default => array_slice($allStarts, 0, 5),
            };

            foreach ($days as $day) {
                foreach ($starts as $start) {
                    $end = SessionSlots::endTimeFor($start);
                    if ($end === null) {
                        continue;
                    }

                    $rows[] = [
                        'user_id' => $mentor->id,
                        'day_of_week' => $day,
                        'start_time' => $start,
                        'end_time' => $end,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }
        }

        foreach (array_chunk($rows, 500) as $chunk) {
            MentorAvailability::query()->insert($chunk);
        }
    }
}
