<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use Modules\User\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['mobile' => '09120000000'],
            [
                'name' => 'Neda Admin',
                'email' => 'neda.admin@example.com',
                'password' => 'password',
                'role' => UserRole::Admin,
            ],
        );

        User::query()->updateOrCreate(
            ['mobile' => '09121111111'],
            [
                'name' => 'Dr. Reza Karimi',
                'email' => 'reza.karimi@example.com',
                'password' => 'password',
                'role' => UserRole::Mentor,
            ],
        );

        User::query()->updateOrCreate(
            ['mobile' => '09123333333'],
            [
                'name' => 'Dr. Sara Ahmadi',
                'email' => 'sara.ahmadi@example.com',
                'password' => 'password',
                'role' => UserRole::Mentor,
            ],
        );

        User::query()->updateOrCreate(
            ['mobile' => '09122222222'],
            [
                'name' => 'Maryam Client',
                'email' => 'maryam.client@example.com',
                'password' => 'password',
                'role' => UserRole::User,
            ],
        );

        User::query()->updateOrCreate(
            ['mobile' => '09124444444'],
            [
                'name' => 'Ali Client',
                'email' => 'ali.client@example.com',
                'password' => 'password',
                'role' => UserRole::User,
            ],
        );

        $this->call([
            AreaOfExpertiseSeeder::class,
            MentorAvailabilitySeeder::class,
            AppointmentSeeder::class,
        ]);
    }
}
