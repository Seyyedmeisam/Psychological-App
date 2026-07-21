<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            DemoAccountsSeeder::class,
            BulkUsersSeeder::class,
            AreaOfExpertiseSeeder::class,
            MentorAvailabilitySeeder::class,
            AppointmentSeeder::class,
            ChatSeeder::class,
        ]);
    }
}
