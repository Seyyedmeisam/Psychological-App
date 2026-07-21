<?php

namespace Modules\Appointment\Http\Requests;

use App\Enums\AppointmentStatus;
use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Modules\Appointment\Models\Appointment;
use Modules\User\Models\User;

class UpdateAppointmentStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var User|null $user */
        $user = $this->user();
        /** @var Appointment $appointment */
        $appointment = $this->route('appointment');

        if ($user === null) {
            return false;
        }

        if ($user->role === UserRole::Admin) {
            return true;
        }

        if ($user->role === UserRole::Mentor && $appointment->mentor_id === $user->id) {
            return true;
        }

        return false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'status' => [
                'required',
                'string',
                Rule::in([
                    AppointmentStatus::Cancelled->value,
                    AppointmentStatus::UserAbsent->value,
                    AppointmentStatus::MentorAbsent->value,
                    AppointmentStatus::Confirmed->value,
                ]),
            ],
        ];
    }
}
