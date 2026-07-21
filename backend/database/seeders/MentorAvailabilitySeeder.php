<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use Modules\Appointment\Models\MentorAvailability;
use Modules\User\Models\User;
use App\Support\SessionSlots;
use Illuminate\Database\Seeder;

class MentorAvailabilitySeeder extends Seeder
{
    public function run(): void
    {
        $mentors = User::query()
            ->where('role', UserRole::Mentor)
            ->whereIn('mobile', ['09121111111', '09123333333'])
            ->get()
            ->keyBy('mobile');

        if ($mentors->isEmpty()) {
            return;
        }

        $allStarts = SessionSlots::startTimes();

        $plans = [
            '09121111111' => [
                'days' => [0, 1, 2, 3, 4],
                'starts' => $allStarts,
            ],
            '09123333333' => [
                'days' => [1, 2, 3, 4, 5],
                'starts' => array_slice($allStarts, 2),
            ],
        ];

        foreach ($plans as $mobile => $plan) {
            $mentor = $mentors->get($mobile);
            if (! $mentor) {
                continue;
            }

            MentorAvailability::query()->where('user_id', $mentor->id)->delete();

            $rows = [];
            foreach ($plan['days'] as $day) {
                foreach ($plan['starts'] as $start) {
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
}
