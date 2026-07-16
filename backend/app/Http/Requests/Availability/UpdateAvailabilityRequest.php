<?php

namespace App\Http\Requests\Availability;

use App\Support\SessionSlots;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class UpdateAvailabilityRequest extends FormRequest
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
            'slots' => ['required', 'array'],
            'slots.*.day_of_week' => ['required', 'integer', 'between:0,6'],
            'slots.*.start_time' => [
                'required',
                'string',
                Rule::in(SessionSlots::startTimes()),
            ],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $seen = [];

            foreach ($this->input('slots', []) as $index => $slot) {
                $day = $slot['day_of_week'] ?? null;
                $start = $slot['start_time'] ?? null;

                if ($day === null || $start === null) {
                    continue;
                }

                $key = "{$day}|{$start}";

                if (isset($seen[$key])) {
                    $validator->errors()->add(
                        "slots.{$index}.start_time",
                        'Duplicate slot for the same day and start time.'
                    );
                }

                $seen[$key] = true;
            }
        });
    }
}
