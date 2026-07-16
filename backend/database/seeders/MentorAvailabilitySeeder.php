<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\MentorAvailability;
use App\Models\User;
use App\Support\SessionSlots;
use Illuminate\Database\Seeder;

class MentorAvailabilitySeeder extends Seeder
{
    public function run(): void
    {
        $mentor = User::query()
            ->where('mobile', '09121111111')
            ->where('role', UserRole::Mentor)
            ->first();

        if (! $mentor) {
            return;
        }

        MentorAvailability::query()->where('user_id', $mentor->id)->delete();

        $starts = array_slice(SessionSlots::startTimes(), 0, 4);
        $rows = [];

        // Mon–Thu mornings/afternoons for demo
        foreach ([0, 1, 2, 3] as $day) {
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

        if ($rows !== []) {
            MentorAvailability::query()->insert($rows);
        }
    }
}
