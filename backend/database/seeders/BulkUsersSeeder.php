<?php

namespace Database\Seeders;

use App\Enums\MentorVerificationStatus;
use App\Enums\UserRole;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Modules\User\Models\User;

class BulkUsersSeeder extends Seeder
{
    private const MENTOR_COUNT = 10;

    private const CLIENT_COUNT = 45;

    /** @var list<string> */
    private const FIRST_NAMES = [
        'Nima', 'Parisa', 'Arman', 'Yasamin', 'Kian', 'Darya', 'Omid', 'Negin',
        'Sina', 'Elham', 'Ramin', 'Shirin', 'Behnam', 'Arezoo', 'Farhad', 'Mahsa',
        'Pouria', 'Nasim', 'Vahid', 'Samira', 'Ashkan', 'Roya', 'Mehdi', 'Ladan',
        'Hamed', 'Setareh', 'Babak', 'Golnaz', 'Iman', 'Taraneh', 'Saeed', 'Hanieh',
        'Kasra', 'Melika', 'Arash', 'Niloufar', 'Peyman', 'Sahar', 'Reza', 'Fatemeh',
        'Amir', 'Maryam', 'Ali', 'Zahra', 'Hossein', 'Sara', 'Mohammad', 'Nazanin',
    ];

    /** @var list<string> */
    private const LAST_NAMES = [
        'Mohammadi', 'Hosseini', 'Ahmadi', 'Karimi', 'Rezaei', 'Moradi', 'Mousavi',
        'Jafari', 'Nouri', 'Ghasemi', 'Ebrahimi', 'Kazemi', 'Rahimi', 'Asadi',
        'Bagheri', 'Najafi', 'Abbasi', 'Hashemi', 'Sadeghi', 'Mirzaei', 'Yazdani',
        'Shirazi', 'Tehrani', 'Esfahani', 'Kiani', 'Bahrami', 'Zamani', 'Rostami',
    ];

    public function run(): void
    {
        $password = Hash::make('password');

        $mentorBios = [
            'CBT practitioner supporting adults with anxiety and workplace stress.',
            'Family systems therapist with a warm, structured approach.',
            'Adolescent counselor helping teens with confidence and school pressure.',
            'Licensed psychologist focused on mood disorders and relapse prevention.',
            'Integrative therapist blending mindfulness and evidence-based tools.',
        ];

        for ($i = 1; $i <= self::MENTOR_COUNT; $i++) {
            $mobile = sprintf('0913%07d', $i);
            $status = match (true) {
                $i === self::MENTOR_COUNT => MentorVerificationStatus::Pending,
                $i === self::MENTOR_COUNT - 1 => MentorVerificationStatus::Rejected,
                default => MentorVerificationStatus::Approved,
            };

            User::query()->updateOrCreate(
                ['mobile' => $mobile],
                [
                    'name' => $this->personName($i, prefix: 'Dr. '),
                    'email' => sprintf('mentor.bulk%02d@example.com', $i),
                    'password' => $password,
                    'role' => UserRole::Mentor,
                    'bio' => $mentorBios[($i - 1) % count($mentorBios)],
                    'mentor_verification_status' => $status,
                    'mentor_verification_note' => $status === MentorVerificationStatus::Rejected
                        ? 'Missing official stamp on the uploaded certificate.'
                        : null,
                    'mentor_verified_at' => $status === MentorVerificationStatus::Approved
                        ? now()->subDays(10 + $i)
                        : null,
                ],
            );
        }

        for ($i = 1; $i <= self::CLIENT_COUNT; $i++) {
            $mobile = sprintf('0914%07d', $i);

            User::query()->updateOrCreate(
                ['mobile' => $mobile],
                [
                    'name' => $this->personName($i + 20),
                    'email' => sprintf('client.bulk%02d@example.com', $i),
                    'password' => $password,
                    'role' => UserRole::User,
                    'bio' => null,
                    'mentor_verification_status' => null,
                    'mentor_verification_note' => null,
                    'mentor_verified_at' => null,
                ],
            );
        }
    }

    private function personName(int $seed, string $prefix = ''): string
    {
        $first = self::FIRST_NAMES[$seed % count(self::FIRST_NAMES)];
        $last = self::LAST_NAMES[($seed * 3) % count(self::LAST_NAMES)];

        return $prefix.$first.' '.$last;
    }
}
