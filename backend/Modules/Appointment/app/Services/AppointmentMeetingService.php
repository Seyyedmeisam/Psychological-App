<?php

namespace Modules\Appointment\Services;

use Modules\Appointment\Models\Appointment;

use Illuminate\Validation\ValidationException;

class AppointmentMeetingService
{
    public function __construct(
        private readonly GoogleMeetService $googleMeet,
    ) {}

    public function ensureMeetingUrl(Appointment $appointment): string
    {
        return $this->googleMeet->ensureMeetingUrl($appointment);
    }

    /**
     * @return array{meeting_url: string, can_join_meeting: bool, is_in_session: bool}
     */
    public function joinPayload(Appointment $appointment): array
    {
        if (! $appointment->canJoinMeeting()) {
            throw ValidationException::withMessages([
                'meeting' => ['Meeting is not available to join yet.'],
            ]);
        }

        $url = $this->ensureMeetingUrl($appointment);

        return [
            'meeting_url' => $url,
            'can_join_meeting' => true,
            'is_in_session' => true,
        ];
    }
}
