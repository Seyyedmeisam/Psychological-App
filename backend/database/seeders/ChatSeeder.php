<?php

namespace Database\Seeders;

use App\Enums\MentorVerificationStatus;
use App\Enums\UserRole;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Modules\Chat\Models\Conversation;
use Modules\Chat\Models\Message;
use Modules\User\Models\User;

class ChatSeeder extends Seeder
{
    public function run(): void
    {
        Message::query()->delete();
        Conversation::query()->delete();

        $mentors = User::query()
            ->where('role', UserRole::Mentor)
            ->where('mentor_verification_status', MentorVerificationStatus::Approved)
            ->orderBy('id')
            ->take(8)
            ->get();

        $clients = User::query()
            ->where('role', UserRole::User)
            ->orderBy('id')
            ->take(20)
            ->get();

        if ($mentors->isEmpty() || $clients->isEmpty()) {
            return;
        }

        $scripts = [
            [
                ['client', 'Hello doctor, I wanted to confirm our next session.'],
                ['mentor', 'Hi! Yes, we are confirmed. Feel free to note any topics beforehand.'],
                ['client', 'I have been practicing the breathing exercise you shared.'],
                ['mentor', 'That is great progress. We can refine it together next time.'],
            ],
            [
                ['client', 'Is it okay if I arrive five minutes early?'],
                ['mentor', 'Of course. Join whenever the meeting window opens.'],
                ['client', 'Thank you, see you then.'],
            ],
            [
                ['mentor', 'Reminder: please complete the short mood log before our session.'],
                ['client', 'Done — I uploaded notes in my journal.'],
                ['mentor', 'Perfect, I will review them before we meet.'],
            ],
            [
                ['client', 'I had a difficult week at work.'],
                ['mentor', 'I am sorry to hear that. We can unpack it in our next appointment.'],
                ['client', 'Looking forward to it.'],
                ['mentor', 'You are not alone in this — we will take it step by step.'],
            ],
        ];

        $now = Carbon::now();
        $pairCount = min(18, $clients->count() * 2);

        for ($i = 0; $i < $pairCount; $i++) {
            $client = $clients[$i % $clients->count()];
            $mentor = $mentors[$i % $mentors->count()];
            if ($client->id === $mentor->id) {
                continue;
            }

            $pair = Conversation::pairIds($client->id, $mentor->id);
            $conversation = Conversation::query()->firstOrCreate($pair, [
                'last_message_at' => null,
            ]);

            $script = $scripts[$i % count($scripts)];
            $base = $now->copy()->subDays(12 - ($i % 12))->subHours($i % 5);

            foreach ($script as $step => [$who, $body]) {
                $senderId = $who === 'client' ? $client->id : $mentor->id;
                $created = $base->copy()->addMinutes($step * 17);

                Message::query()->create([
                    'conversation_id' => $conversation->id,
                    'sender_id' => $senderId,
                    'body' => $body,
                    'created_at' => $created,
                    'updated_at' => $created,
                ]);

                $conversation->forceFill(['last_message_at' => $created])->save();
            }
        }
    }
}
