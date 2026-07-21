<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use Modules\Appointment\Models\Appointment;
use Modules\Appointment\Models\AppointmentRating;
use Modules\Appointment\Models\AreaOfExpertise;
use Modules\User\Models\User;
use App\Support\SessionSlots;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class AppointmentSeeder extends Seeder
{
    public function run(): void
    {
        $reza = User::query()->where('mobile', '09121111111')->where('role', UserRole::Mentor)->first();
        $sara = User::query()->where('mobile', '09123333333')->where('role', UserRole::Mentor)->first();
        $maryam = User::query()->where('mobile', '09122222222')->where('role', UserRole::User)->first();
        $ali = User::query()->where('mobile', '09124444444')->where('role', UserRole::User)->first();

        if (! $reza || ! $sara || ! $maryam || ! $ali) {
            return;
        }

        $anxiety = AreaOfExpertise::query()->where('slug', 'anxiety-stress')->first();
        $depression = AreaOfExpertise::query()->where('slug', 'depression')->first();
        $couples = AreaOfExpertise::query()->where('slug', 'couples-therapy')->first();
        $child = AreaOfExpertise::query()->where('slug', 'child-psychology')->first();
        $selfEsteem = AreaOfExpertise::query()->where('slug', 'self-esteem')->first();

        if (! $anxiety || ! $depression || ! $couples || ! $child || ! $selfEsteem) {
            return;
        }

        Appointment::query()->delete();
        AppointmentRating::query()->delete();

        $slots = SessionSlots::all();
        $morning = $slots[2] ?? $slots[0];
        $afternoon = $slots[4] ?? $slots[1];
        $evening = $slots[5] ?? $slots[2];

        $rows = [
            [
                'client' => $maryam,
                'mentor' => $reza,
                'area' => $anxiety,
                'date' => Carbon::today()->subDays(10),
                'slot' => $morning,
                'status' => 'confirmed',
                'rating' => ['score' => 5, 'comment' => 'Calm, clear, and very helpful.'],
            ],
            [
                'client' => $maryam,
                'mentor' => $reza,
                'area' => $depression,
                'date' => Carbon::today()->subDays(3),
                'slot' => $afternoon,
                'status' => 'confirmed',
                'rating' => ['score' => 4, 'comment' => 'Felt understood and supported.'],
            ],
            // Past completed — Ali with Sara
            [
                'client' => $ali,
                'mentor' => $sara,
                'area' => $selfEsteem,
                'date' => Carbon::today()->subDays(7),
                'slot' => $evening,
                'status' => 'confirmed',
                'rating' => ['score' => 5, 'comment' => 'Practical tools I can use every day.'],
            ],
            [
                'client' => $ali,
                'mentor' => $sara,
                'area' => $couples,
                'date' => Carbon::today()->subDays(2),
                'slot' => $morning,
                'status' => 'confirmed',
                'rating' => null,
            ],
            // Cancelled
            [
                'client' => $maryam,
                'mentor' => $sara,
                'area' => $child,
                'date' => Carbon::today()->subDays(5),
                'slot' => $afternoon,
                'status' => 'cancelled',
                'rating' => null,
            ],
            [
                'client' => $ali,
                'mentor' => $reza,
                'area' => $anxiety,
                'date' => Carbon::today()->addDays(1),
                'slot' => $morning,
                'status' => 'cancelled',
                'rating' => null,
            ],
            // Upcoming confirmed
            [
                'client' => $maryam,
                'mentor' => $reza,
                'area' => $anxiety,
                'date' => Carbon::today()->addDays(2),
                'slot' => $afternoon,
                'status' => 'confirmed',
                'rating' => null,
            ],
            [
                'client' => $ali,
                'mentor' => $sara,
                'area' => $selfEsteem,
                'date' => Carbon::today()->addDays(3),
                'slot' => $evening,
                'status' => 'confirmed',
                'rating' => null,
            ],
            [
                'client' => $maryam,
                'mentor' => $sara,
                'area' => $couples,
                'date' => Carbon::today()->addDays(4),
                'slot' => $morning,
                'status' => 'confirmed',
                'rating' => null,
            ],
        ];

        $now = Carbon::now();
        foreach ($slots as $slot) {
            $start = Carbon::parse(Carbon::today()->toDateString().' '.$slot['start']);
            $end = Carbon::parse(Carbon::today()->toDateString().' '.$slot['end']);
            if ($now->between($start, $end)) {
                $rows[] = [
                    'client' => $maryam,
                    'mentor' => $reza,
                    'area' => $anxiety,
                    'date' => Carbon::today(),
                    'slot' => $slot,
                    'status' => 'confirmed',
                    'rating' => null,
                ];
                break;
            }
        }

        foreach ($rows as $row) {
            $appointment = Appointment::query()->create([
                'client_id' => $row['client']->id,
                'mentor_id' => $row['mentor']->id,
                'area_of_expertise_id' => $row['area']->id,
                'date' => $row['date']->toDateString(),
                'start_time' => $row['slot']['start'],
                'end_time' => $row['slot']['end'],
                'status' => $row['status'],
                'notes' => null,
            ]);

            if ($row['rating'] !== null) {
                AppointmentRating::query()->create([
                    'appointment_id' => $appointment->id,
                    'client_id' => $row['client']->id,
                    'mentor_id' => $row['mentor']->id,
                    'score' => $row['rating']['score'],
                    'comment' => $row['rating']['comment'],
                ]);
            }
        }
    }
}
