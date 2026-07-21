<?php

use Modules\Appointment\Models\Appointment;
use Modules\Appointment\Services\AppointmentMeetingService;
use Illuminate\Support\Facades\Http;

require __DIR__.'/../vendor/autoload.php';
$app = require __DIR__.'/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$base = 'http://127.0.0.1:8000/api';
$failures = 0;

function step(string $label, bool $ok, string $detail = ''): void
{
    global $failures;
    $status = $ok ? 'PASS' : 'FAIL';
    if (! $ok) {
        $failures++;
    }
    echo "[{$status}] {$label}".($detail !== '' ? " — {$detail}" : '').PHP_EOL;
}

$now = now();
$start = $now->copy()->subMinutes(10)->format('H:i');
$end = $now->copy()->addMinutes(80)->format('H:i');

$appointment = Appointment::query()
    ->where('status', 'confirmed')
    ->orderByDesc('id')
    ->first();

if (! $appointment) {
    echo "No confirmed appointment found.\n";
    exit(1);
}

$appointment->update([
    'date' => $now->toDateString(),
    'start_time' => $start,
    'end_time' => $end,
    'meeting_url' => null,
]);
$appointment->refresh();

step('Appointment in session window', $appointment->canJoinMeeting(), "{$start}–{$end} on {$appointment->date}");

$loginClient = Http::acceptJson()->post("{$base}/auth/login", [
    'mobile' => '09122222222',
    'password' => 'password',
]);
step('Client login', $loginClient->successful(), (string) $loginClient->status());
$clientToken = $loginClient->json('data.token');
step('Client token received', is_string($clientToken) && $clientToken !== '');

$loginMentor = Http::acceptJson()->post("{$base}/auth/login", [
    'mobile' => '09121111111',
    'password' => 'password',
]);
step('Mentor login', $loginMentor->successful());
$mentorToken = $loginMentor->json('data.token');

$outside = Appointment::query()->where('status', 'confirmed')->where('id', '!=', $appointment->id)->first();
if ($outside) {
    $outside->update([
        'date' => $now->copy()->addDays(2)->toDateString(),
        'start_time' => '10:30',
        'end_time' => '12:00',
    ]);
    $joinBlocked = Http::withToken($clientToken)
        ->acceptJson()
        ->post("{$base}/appointments/{$outside->id}/meeting/join");
    step('Join blocked outside session', $joinBlocked->status() === 422, (string) $joinBlocked->status());
}

$joinClient = Http::withToken($clientToken)
    ->acceptJson()
    ->post("{$base}/appointments/{$appointment->id}/meeting/join");
$clientUrl = $joinClient->json('data.meeting_url');
step(
    'Client join meeting',
    $joinClient->successful() && is_string($clientUrl) && str_contains($clientUrl, 'meet.google.com'),
    is_string($clientUrl) ? $clientUrl : (string) $joinClient->body(),
);

$joinMentor = Http::withToken($mentorToken)
    ->acceptJson()
    ->post("{$base}/appointments/{$appointment->id}/meeting/join");
$mentorUrl = $joinMentor->json('data.meeting_url');
step(
    'Mentor gets same meeting URL',
    $joinMentor->successful() && $mentorUrl === $clientUrl,
    (string) $mentorUrl,
);

$list = Http::withToken($clientToken)
    ->acceptJson()
    ->get("{$base}/appointments");
$listed = collect($list->json('data'))->firstWhere('id', $appointment->id);
step(
    'Appointments list exposes join flags',
    $list->successful()
        && ($listed['can_join_meeting'] ?? false) === true
        && ($listed['is_in_session'] ?? false) === true
        && ! empty($listed['meeting_url']),
);

/** @var AppointmentMeetingService $meetingService */
$meetingService = app(AppointmentMeetingService::class);
$urlFromService = $meetingService->ensureMeetingUrl($appointment->fresh());
step('Meeting URL persisted on appointment', $appointment->fresh()->meeting_url === $urlFromService);

if ($failures > 0) {
    echo PHP_EOL."{$failures} test(s) failed.".PHP_EOL;
    exit(1);
}

echo PHP_EOL.'All meeting join tests passed.'.PHP_EOL;
exit(0);
