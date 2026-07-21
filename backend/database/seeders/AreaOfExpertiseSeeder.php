<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use Illuminate\Database\Seeder;
use Modules\Appointment\Models\AreaOfExpertise;
use Modules\User\Models\User;

class AreaOfExpertiseSeeder extends Seeder
{
    public function run(): void
    {
        $areas = [
            ['slug' => 'child-psychology', 'name' => 'روانشناسی کودک', 'name_en' => 'Child psychology', 'sort_order' => 1],
            ['slug' => 'adolescent-psychology', 'name' => 'روانشناسی نوجوان', 'name_en' => 'Adolescent psychology', 'sort_order' => 2],
            ['slug' => 'couples-therapy', 'name' => 'زوج‌درمانی', 'name_en' => 'Couples therapy', 'sort_order' => 3],
            ['slug' => 'anxiety-stress', 'name' => 'اضطراب و استرس', 'name_en' => 'Anxiety and stress', 'sort_order' => 4],
            ['slug' => 'depression', 'name' => 'افسردگی', 'name_en' => 'Depression', 'sort_order' => 5],
            ['slug' => 'family-therapy', 'name' => 'خانواده‌درمانی', 'name_en' => 'Family therapy', 'sort_order' => 6],
            ['slug' => 'self-esteem', 'name' => 'اعتماد به نفس', 'name_en' => 'Self-esteem', 'sort_order' => 7],
            ['slug' => 'learning-disorders', 'name' => 'اختلالات یادگیری', 'name_en' => 'Learning disorders', 'sort_order' => 8],
            ['slug' => 'trauma-ptsd', 'name' => 'تروما و PTSD', 'name_en' => 'Trauma and PTSD', 'sort_order' => 9],
            ['slug' => 'addiction', 'name' => 'اعتیاد', 'name_en' => 'Addiction', 'sort_order' => 10],
        ];

        foreach ($areas as $area) {
            AreaOfExpertise::query()->updateOrCreate(
                ['slug' => $area['slug']],
                [
                    'name' => $area['name'],
                    'name_en' => $area['name_en'],
                    'is_active' => true,
                    'sort_order' => $area['sort_order'],
                ],
            );
        }

        $allIds = AreaOfExpertise::query()->orderBy('sort_order')->pluck('id')->all();
        if ($allIds === []) {
            return;
        }

        $mentorPlans = [
            '09121111111' => ['child-psychology', 'adolescent-psychology', 'anxiety-stress', 'depression', 'self-esteem'],
            '09123333333' => ['couples-therapy', 'family-therapy', 'anxiety-stress', 'self-esteem', 'trauma-ptsd'],
            '09125555555' => ['child-psychology', 'learning-disorders', 'adolescent-psychology', 'self-esteem'],
            '09126666666' => ['trauma-ptsd', 'addiction', 'depression', 'anxiety-stress'],
            '09127777777' => ['anxiety-stress', 'depression'],
            '09128888888' => ['family-therapy', 'couples-therapy'],
        ];

        foreach ($mentorPlans as $mobile => $slugs) {
            $mentor = User::query()
                ->where('mobile', $mobile)
                ->where('role', UserRole::Mentor)
                ->first();
            if (! $mentor) {
                continue;
            }
            $ids = AreaOfExpertise::query()->whereIn('slug', $slugs)->pluck('id');
            $mentor->areasOfExpertise()->sync($ids);
        }

        $bulkMentors = User::query()
            ->where('role', UserRole::Mentor)
            ->where('mobile', 'like', '0913%')
            ->orderBy('id')
            ->get();

        foreach ($bulkMentors as $index => $mentor) {
            $chunk = collect($allIds)
                ->sortBy(fn (int $id) => crc32($mentor->id.'|'.$id))
                ->take(3 + ($index % 3))
                ->values()
                ->all();
            $mentor->areasOfExpertise()->sync($chunk);
        }
    }
}
