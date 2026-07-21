<?php

namespace Modules\Appointment\Http\Requests;

use App\Support\SessionSlots;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAppointmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
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
