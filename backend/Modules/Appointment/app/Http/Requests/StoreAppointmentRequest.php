<?php

namespace Modules\Appointment\Http\Requests;

use App\Enums\UserRole;
use App\Support\SessionSlots;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Modules\User\Models\User;

class StoreAppointmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var User|null $user */
        $user = $this->user();

        return $user !== null
            && in_array($user->role, [UserRole::User, UserRole::Admin], true);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'area_of_expertise_id' => ['required', 'integer', 'exists:areas_of_expertise,id'],
            'mentor_id' => ['required', 'integer', 'exists:users,id'],
            'date' => ['required', 'date', 'after_or_equal:today'],
            'start_time' => [
                'required',
                'string',
                Rule::in(SessionSlots::startTimes()),
            ],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
