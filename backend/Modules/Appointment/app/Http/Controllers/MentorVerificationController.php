<?php

namespace Modules\Appointment\Http\Controllers;

use App\Enums\MentorVerificationStatus;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Modules\Appointment\Models\MentorVerificationEvidence;
use Modules\User\Http\Resources\UserResource;
use Modules\User\Models\User;

class MentorVerificationController extends Controller
{
    public function showMine(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();
        $user->load(['verificationEvidences.areaOfExpertise:id,name,name_en']);

        return response()->json([
            'data' => [
                'status' => $user->mentor_verification_status?->value,
                'note' => $user->mentor_verification_note,
                'verified_at' => $user->mentor_verified_at?->toIso8601String(),
                'evidences' => $user->verificationEvidences->map(fn (MentorVerificationEvidence $item) => [
                    'id' => $item->id,
                    'original_name' => $item->original_name,
                    'mime' => $item->mime,
                    'size' => $item->size,
                    'url' => $item->url(),
                    'area_of_expertise' => $item->areaOfExpertise
                        ? [
                            'id' => $item->areaOfExpertise->id,
                            'name' => $item->areaOfExpertise->name,
                        ]
                        : null,
                    'created_at' => $item->created_at?->toIso8601String(),
                ])->values()->all(),
            ],
        ]);
    }

    public function storeEvidence(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $validated = $request->validate([
            'file' => ['required', 'file', 'max:5120', 'mimes:jpg,jpeg,png,webp,pdf'],
            'area_of_expertise_id' => ['nullable', 'integer', 'exists:areas_of_expertise,id'],
        ]);

        $file = $validated['file'];
        $path = $file->store('mentor-evidence/'.$user->id, 'public');

        $evidence = $user->verificationEvidences()->create([
            'area_of_expertise_id' => $validated['area_of_expertise_id'] ?? null,
            'path' => $path,
            'original_name' => $file->getClientOriginalName(),
            'mime' => $file->getClientMimeType(),
            'size' => $file->getSize() ?: 0,
        ]);

        if (
            $user->mentor_verification_status === MentorVerificationStatus::Rejected
            || $user->mentor_verification_status === null
        ) {
            $user->forceFill([
                'mentor_verification_status' => MentorVerificationStatus::Pending,
                'mentor_verification_note' => null,
                'mentor_verified_at' => null,
                'mentor_verified_by' => null,
            ])->save();
        }

        $evidence->load('areaOfExpertise:id,name,name_en');

        return response()->json([
            'data' => [
                'id' => $evidence->id,
                'original_name' => $evidence->original_name,
                'mime' => $evidence->mime,
                'size' => $evidence->size,
                'url' => $evidence->url(),
                'area_of_expertise' => $evidence->areaOfExpertise
                    ? [
                        'id' => $evidence->areaOfExpertise->id,
                        'name' => $evidence->areaOfExpertise->name,
                    ]
                    : null,
                'created_at' => $evidence->created_at?->toIso8601String(),
                'status' => $user->fresh()->mentor_verification_status?->value,
            ],
        ], 201);
    }

    public function destroyEvidence(Request $request, MentorVerificationEvidence $evidence): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        if ($evidence->user_id !== $user->id) {
            abort(403);
        }

        Storage::disk('public')->delete($evidence->path);
        $evidence->delete();

        return response()->json(null, 204);
    }

    public function adminIndex(Request $request): JsonResponse
    {
        $status = $request->string('status')->toString();

        $query = User::query()
            ->where('role', UserRole::Mentor)
            ->with([
                'verificationEvidences.areaOfExpertise:id,name',
                'areasOfExpertise:id,name',
            ])
            ->latest();

        if ($status === 'all') {
            // no status filter
        } elseif ($status !== '' && in_array($status, MentorVerificationStatus::values(), true)) {
            $query->where('mentor_verification_status', $status);
        } else {
            $query->where('mentor_verification_status', MentorVerificationStatus::Pending);
        }

        $mentors = $query->get()->map(function (User $mentor) {
            return [
                'user' => (new UserResource($mentor))->resolve(),
                'expertise' => $mentor->areasOfExpertise->map(fn ($area) => [
                    'id' => $area->id,
                    'name' => $area->name,
                ])->values()->all(),
                'evidences' => $mentor->verificationEvidences->map(fn (MentorVerificationEvidence $item) => [
                    'id' => $item->id,
                    'original_name' => $item->original_name,
                    'mime' => $item->mime,
                    'size' => $item->size,
                    'url' => $item->url(),
                    'area_of_expertise' => $item->areaOfExpertise
                        ? ['id' => $item->areaOfExpertise->id, 'name' => $item->areaOfExpertise->name]
                        : null,
                    'created_at' => $item->created_at?->toIso8601String(),
                ])->values()->all(),
            ];
        });

        return response()->json(['data' => $mentors]);
    }

    public function approve(Request $request, User $user): JsonResponse
    {
        if ($user->role !== UserRole::Mentor) {
            abort(422, 'User is not a mentor.');
        }

        $user->forceFill([
            'mentor_verification_status' => MentorVerificationStatus::Approved,
            'mentor_verification_note' => null,
            'mentor_verified_at' => now(),
            'mentor_verified_by' => $request->user()->id,
        ])->save();

        return response()->json(['data' => new UserResource($user->fresh())]);
    }

    public function reject(Request $request, User $user): JsonResponse
    {
        if ($user->role !== UserRole::Mentor) {
            abort(422, 'User is not a mentor.');
        }

        $validated = $request->validate([
            'note' => ['nullable', 'string', 'max:1000'],
        ]);

        $user->forceFill([
            'mentor_verification_status' => MentorVerificationStatus::Rejected,
            'mentor_verification_note' => $validated['note'] ?? null,
            'mentor_verified_at' => now(),
            'mentor_verified_by' => $request->user()->id,
        ])->save();

        return response()->json(['data' => new UserResource($user->fresh())]);
    }
}
