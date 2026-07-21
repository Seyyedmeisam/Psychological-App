<?php

namespace Modules\Auth\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $userId = $this->user()?->id;

        return [
            'name' => ['required', 'string', 'max:255'],
            'mobile' => [
                'required',
                'string',
                'regex:/^\+?[0-9]{10,15}$/',
                Rule::unique('users', 'mobile')->ignore($userId),
            ],
            'bio' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
