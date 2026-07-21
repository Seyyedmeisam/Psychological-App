<?php

namespace Database\Seeders;

use App\Enums\MentorVerificationStatus;
use App\Enums\UserRole;
use Illuminate\Database\Seeder;
use Modules\User\Models\User;

class DemoAccountsSeeder extends Seeder
{
    public function run(): void
    {
        $accounts = [
            [
                'mobile' => '09120000000',
                'name' => 'Neda Admin',
                'email' => 'neda.admin@example.com',
                'role' => UserRole::Admin,
                'bio' => null,
                'mentor_verification_status' => null,
            ],
            [
                'mobile' => '09121111111',
                'name' => 'Dr. Reza Karimi',
                'email' => 'reza.karimi@example.com',
                'role' => UserRole::Mentor,
                'bio' => 'Clinical psychologist focused on anxiety, depression, and adolescent counseling with 12+ years of practice.',
                'mentor_verification_status' => MentorVerificationStatus::Approved,
            ],
            [
                'mobile' => '09123333333',
                'name' => 'Dr. Sara Ahmadi',
                'email' => 'sara.ahmadi@example.com',
                'role' => UserRole::Mentor,
                'bio' => 'Couples and family therapist helping partners rebuild trust and communication.',
                'mentor_verification_status' => MentorVerificationStatus::Approved,
            ],
            [
                'mobile' => '09125555555',
                'name' => 'Dr. Mina Hosseini',
                'email' => 'mina.hosseini@example.com',
                'role' => UserRole::Mentor,
                'bio' => 'Child and learning specialist with CBT and play-therapy training.',
                'mentor_verification_status' => MentorVerificationStatus::Approved,
            ],
            [
                'mobile' => '09126666666',
                'name' => 'Dr. Kamran Norouzi',
                'email' => 'kamran.norouzi@example.com',
                'role' => UserRole::Mentor,
                'bio' => 'Trauma-informed counselor specializing in PTSD and addiction recovery.',
                'mentor_verification_status' => MentorVerificationStatus::Approved,
            ],
            [
                'mobile' => '09127777777',
                'name' => 'Dr. Leila Rahmani',
                'email' => 'leila.rahmani@example.com',
                'role' => UserRole::Mentor,
                'bio' => null,
                'mentor_verification_status' => MentorVerificationStatus::Pending,
            ],
            [
                'mobile' => '09128888888',
                'name' => 'Dr. Pouya Sharifi',
                'email' => 'pouya.sharifi@example.com',
                'role' => UserRole::Mentor,
                'bio' => 'Awaiting clearer license documentation.',
                'mentor_verification_status' => MentorVerificationStatus::Rejected,
            ],
            [
                'mobile' => '09122222222',
                'name' => 'Maryam Client',
                'email' => 'maryam.client@example.com',
                'role' => UserRole::User,
                'bio' => null,
                'mentor_verification_status' => null,
            ],
            [
                'mobile' => '09124444444',
                'name' => 'Ali Client',
                'email' => 'ali.client@example.com',
                'role' => UserRole::User,
                'bio' => null,
                'mentor_verification_status' => null,
            ],
            [
                'mobile' => '09129990001',
                'name' => 'Zahra Moradi',
                'email' => 'zahra.moradi@example.com',
                'role' => UserRole::User,
                'bio' => null,
                'mentor_verification_status' => null,
            ],
            [
                'mobile' => '09129990002',
                'name' => 'Hossein Jafari',
                'email' => 'hossein.jafari@example.com',
                'role' => UserRole::User,
                'bio' => null,
                'mentor_verification_status' => null,
            ],
        ];

        foreach ($accounts as $account) {
            $payload = [
                'name' => $account['name'],
                'email' => $account['email'],
                'password' => 'password',
                'role' => $account['role'],
                'bio' => $account['bio'],
                'mentor_verification_status' => $account['mentor_verification_status'],
                'mentor_verification_note' => $account['mentor_verification_status'] === MentorVerificationStatus::Rejected
                    ? 'Please upload clearer credentials and a valid license scan.'
                    : null,
                'mentor_verified_at' => $account['mentor_verification_status'] === MentorVerificationStatus::Approved
                    ? now()->subDays(30)
                    : null,
            ];

            User::query()->updateOrCreate(
                ['mobile' => $account['mobile']],
                $payload,
            );
        }
    }
}
