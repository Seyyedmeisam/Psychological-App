<?php

namespace Modules\Appointment\Services;

use Modules\Appointment\Models\Appointment;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class GoogleMeetService
{
    /**
     * Ensure a persistent Google Meet URL exists for this appointment.
     */
    public function ensureMeetingUrl(Appointment $appointment): string
    {
        if (filled($appointment->meeting_url)) {
            return (string) $appointment->meeting_url;
        }

        $url = $this->createMeetingUrl($appointment);
        $appointment->forceFill(['meeting_url' => $url])->save();

        return $url;
    }

    private function createMeetingUrl(Appointment $appointment): string
    {
        $mode = (string) config('services.google.meet.mode', 'dev');

        if ($mode === 'spaces') {
            $url = $this->createViaMeetSpacesApi();
            if ($url !== null) {
                return $url;
            }
        }

        if ($mode === 'calendar') {
            $url = $this->createViaCalendarApi($appointment);
            if ($url !== null) {
                return $url;
            }
        }

        $devUrl = config('services.google.meet.dev_room_url');
        if (is_string($devUrl) && $devUrl !== '') {
            return $devUrl;
        }

        return 'https://meet.google.com/'.$this->syntheticMeetCode($appointment->id);
    }

    private function syntheticMeetCode(int $appointmentId): string
    {
        $hash = hash('sha256', (string) config('app.key').'|meet|'.$appointmentId);
        $chars = 'abcdefghijklmnopqrstuvwxyz';
        $lengths = [3, 4, 3];
        $parts = [];

        foreach ($lengths as $index => $length) {
            $segment = '';
            for ($offset = 0; $offset < $length; $offset++) {
                $byte = hexdec(substr($hash, ($index * 8) + ($offset * 2), 2));
                $segment .= $chars[$byte % 26];
            }
            $parts[] = $segment;
        }

        return implode('-', $parts);
    }

    private function createViaMeetSpacesApi(): ?string
    {
        $token = $this->serviceAccountAccessToken([
            'https://www.googleapis.com/auth/meetings.space.created',
        ]);

        if ($token === null) {
            return null;
        }

        $response = Http::withToken($token)
            ->acceptJson()
            ->post('https://meet.googleapis.com/v2/spaces', (object) []);

        if (! $response->successful()) {
            Log::warning('Google Meet spaces.create failed', [
                'status' => $response->status(),
                'body' => $response->json(),
            ]);

            return null;
        }

        $uri = $response->json('meetingUri');

        return is_string($uri) && $uri !== '' ? $uri : null;
    }

    /**
     * @return array<string, mixed>|null
     */
    private function createViaCalendarApi(Appointment $appointment): ?string
    {
        $token = $this->serviceAccountAccessToken([
            'https://www.googleapis.com/auth/calendar',
        ]);

        if ($token === null) {
            return null;
        }

        $calendarId = (string) config('services.google.meet.calendar_id', 'primary');
        $date = $appointment->date instanceof \Carbon\Carbon
            ? $appointment->date->toDateString()
            : (string) $appointment->date;

        $start = \Carbon\Carbon::parse("{$date} {$appointment->start_time}");
        $end = \Carbon\Carbon::parse("{$date} {$appointment->end_time}");

        $response = Http::withToken($token)
            ->acceptJson()
            ->post(
                'https://www.googleapis.com/calendar/v3/calendars/'.rawurlencode($calendarId).'/events?conferenceDataVersion=1',
                [
                    'summary' => 'Therapy session #'.$appointment->id,
                    'start' => [
                        'dateTime' => $start->toIso8601String(),
                        'timeZone' => config('app.timezone'),
                    ],
                    'end' => [
                        'dateTime' => $end->toIso8601String(),
                        'timeZone' => config('app.timezone'),
                    ],
                    'conferenceData' => [
                        'createRequest' => [
                            'requestId' => Str::uuid()->toString(),
                            'conferenceSolutionKey' => ['type' => 'hangoutsMeet'],
                        ],
                    ],
                ],
            );

        if (! $response->successful()) {
            Log::warning('Google Calendar event create failed', [
                'status' => $response->status(),
                'body' => $response->json(),
            ]);

            return null;
        }

        $uri = $response->json('hangoutLink')
            ?? $response->json('conferenceData.entryPoints.0.uri');

        return is_string($uri) && $uri !== '' ? $uri : null;
    }

    /**
     * @param  list<string>  $scopes
     */
    private function serviceAccountAccessToken(array $scopes): ?string
    {
        $credentialsPath = config('services.google.meet.service_account_json');
        if (! is_string($credentialsPath) || $credentialsPath === '' || ! is_readable($credentialsPath)) {
            return null;
        }

        $json = json_decode((string) file_get_contents($credentialsPath), true);
        if (! is_array($json) || empty($json['client_email']) || empty($json['private_key'])) {
            return null;
        }

        $now = time();
        $claims = [
            'iss' => $json['client_email'],
            'scope' => implode(' ', $scopes),
            'aud' => 'https://oauth2.googleapis.com/token',
            'iat' => $now,
            'exp' => $now + 3600,
        ];

        $impersonate = config('services.google.meet.impersonate');
        if (is_string($impersonate) && $impersonate !== '') {
            $claims['sub'] = $impersonate;
        }

        $jwt = $this->encodeJwt($claims, (string) $json['private_key']);

        $response = Http::asForm()->post('https://oauth2.googleapis.com/token', [
            'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            'assertion' => $jwt,
        ]);

        if (! $response->successful()) {
            Log::warning('Google service account token exchange failed', [
                'status' => $response->status(),
                'body' => $response->json(),
            ]);

            return null;
        }

        $token = $response->json('access_token');

        return is_string($token) && $token !== '' ? $token : null;
    }

    /**
     * @param  array<string, mixed>  $claims
     */
    private function encodeJwt(array $claims, string $privateKey): string
    {
        $header = $this->base64UrlEncode(json_encode(['alg' => 'RS256', 'typ' => 'JWT'], JSON_THROW_ON_ERROR));
        $payload = $this->base64UrlEncode(json_encode($claims, JSON_THROW_ON_ERROR));
        $unsigned = $header.'.'.$payload;

        $signature = '';
        openssl_sign($unsigned, $signature, $privateKey, OPENSSL_ALGO_SHA256);

        return $unsigned.'.'.$this->base64UrlEncode($signature);
    }

    private function base64UrlEncode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
}
