<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['mobile' => '09120000000'],
            [
                'name' => 'Admin',
                'email' => 'admin@example.com',
                'password' => 'password',
                'role' => UserRole::Admin,
            ],
        );

        User::query()->updateOrCreate(
            ['mobile' => '09121111111'],
            [
                'name' => 'Demo Mentor',
                'email' => 'mentor@example.com',
                'password' => 'password',
                'role' => UserRole::Mentor,
            ],
        );

        User::query()->updateOrCreate(
            ['mobile' => '09122222222'],
            [
                'name' => 'Demo User',
                'email' => 'user@example.com',
                'password' => 'password',
                'role' => UserRole::User,
            ],
        );

        $this->call([
            AreaOfExpertiseSeeder::class,
            MentorAvailabilitySeeder::class,
        ]);
    }
}
