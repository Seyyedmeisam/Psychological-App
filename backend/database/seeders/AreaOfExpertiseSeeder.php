<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\AreaOfExpertise;
use App\Models\User;
use Illuminate\Database\Seeder;

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

        $mentor = User::query()
            ->where('mobile', '09121111111')
            ->where('role', UserRole::Mentor)
            ->first();

        if ($mentor) {
            $ids = AreaOfExpertise::query()
                ->whereIn('slug', [
                    'child-psychology',
                    'adolescent-psychology',
                    'anxiety-stress',
                    'depression',
                    'self-esteem',
                ])
                ->pluck('id');

            $mentor->areasOfExpertise()->sync($ids);
        }
    }
}
