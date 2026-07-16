<?php

namespace App\Http\Controllers\Api;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Expertise\UpdateMentorExpertiseRequest;
use App\Models\AreaOfExpertise;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AreaOfExpertiseController extends Controller
{
    public function index(): JsonResponse
    {
        $areas = AreaOfExpertise::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get(['id', 'slug', 'name', 'name_en', 'description', 'sort_order']);

        return response()->json(['data' => $areas]);
    }

    public function showMine(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $ids = $user->areasOfExpertise()->pluck('areas_of_expertise.id');

        return response()->json([
            'data' => [
                'area_of_expertise_ids' => $ids->values()->all(),
            ],
        ]);
    }

    public function updateMine(UpdateMentorExpertiseRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $user->areasOfExpertise()->sync($request->validated('area_of_expertise_ids'));

        $ids = $user->areasOfExpertise()->pluck('areas_of_expertise.id');

        return response()->json([
            'data' => [
                'area_of_expertise_ids' => $ids->values()->all(),
            ],
        ]);
    }

    public function mentorsForArea(AreaOfExpertise $areaOfExpertise): JsonResponse
    {
        $mentors = User::query()
            ->where('role', UserRole::Mentor)
            ->whereHas('areasOfExpertise', static function ($query) use ($areaOfExpertise): void {
                $query->where('areas_of_expertise.id', $areaOfExpertise->id);
            })
            ->orderBy('name')
            ->get(['id', 'name', 'mobile']);

        return response()->json(['data' => $mentors]);
    }
}
