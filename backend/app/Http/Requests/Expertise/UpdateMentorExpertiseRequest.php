<?php

namespace App\Http\Requests\Expertise;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMentorExpertiseRequest extends FormRequest
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
            'area_of_expertise_ids' => ['present', 'array'],
            'area_of_expertise_ids.*' => ['integer', 'distinct', 'exists:areas_of_expertise,id'],
        ];
    }
}
