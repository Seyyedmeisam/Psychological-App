<?php

namespace Modules\Auth\Http\Requests;

use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'mobile' => ['required', 'string', 'regex:/^\+?[0-9]{10,15}$/', 'unique:users,mobile'],
            'password' => ['required', 'confirmed', Password::defaults()],
            'role' => ['sometimes', Rule::in([UserRole::User->value, UserRole::Mentor->value])],
        ];
    }
}
