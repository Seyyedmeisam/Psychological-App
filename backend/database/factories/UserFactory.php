<?php

namespace Database\Factories;

use App\Enums\MentorVerificationStatus;
use App\Enums\UserRole;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Modules\User\Models\User;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    protected $model = User::class;

    protected static ?string $password;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $mobile = '09'.fake()->unique()->numerify('#########');

        return [
            'name' => fake()->name(),
            'mobile' => $mobile,
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'role' => UserRole::User,
            'bio' => null,
            'mentor_verification_status' => null,
            'mentor_verification_note' => null,
            'mentor_verified_at' => null,
            'remember_token' => Str::random(10),
        ];
    }

    public function admin(): static
    {
        return $this->state(fn () => [
            'role' => UserRole::Admin,
            'mentor_verification_status' => null,
        ]);
    }

    public function mentor(MentorVerificationStatus $status = MentorVerificationStatus::Approved): static
    {
        return $this->state(fn () => [
            'role' => UserRole::Mentor,
            'bio' => fake()->optional(0.85)->paragraph(2),
            'mentor_verification_status' => $status,
            'mentor_verification_note' => $status === MentorVerificationStatus::Rejected
                ? 'Please upload clearer credentials and a valid license scan.'
                : null,
            'mentor_verified_at' => $status === MentorVerificationStatus::Approved ? now()->subDays(rand(5, 90)) : null,
        ]);
    }

    public function client(): static
    {
        return $this->state(fn () => [
            'role' => UserRole::User,
            'mentor_verification_status' => null,
            'bio' => null,
        ]);
    }

    public function unverified(): static
    {
        return $this->state(fn () => [
            'email_verified_at' => null,
        ]);
    }
}
