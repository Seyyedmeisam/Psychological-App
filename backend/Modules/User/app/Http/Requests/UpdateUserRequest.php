<?php

namespace Modules\User\Http\Requests;

use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UpdateUserRequest extends FormRequest
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
        $userId = $this->route('user')?->id;

        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'mobile' => [
                'sometimes',
                'required',
                'string',
                'regex:/^\+?[0-9]{10,15}$/',
                Rule::unique('users', 'mobile')->ignore($userId),
            ],
            'email' => [
                'nullable',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($userId),
            ],
            'password' => ['sometimes', 'nullable', 'confirmed', Password::defaults()],
            'role' => ['sometimes', 'required', Rule::in([
                UserRole::Admin->value,
                UserRole::User->value,
                UserRole::Mentor->value,
            ])],
        ];
    }
}
