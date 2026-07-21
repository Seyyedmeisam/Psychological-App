<?php

namespace Modules\Auth\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
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
            'mobile' => ['required', 'string', 'regex:/^\+?[0-9]{10,15}$/'],
            'password' => ['required', 'string'],
        ];
    }
}
