<?php

namespace Modules\User\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

/** @mixin \Modules\User\Models\User */
class UserResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'mobile' => $this->mobile,
            'email' => $this->email,
            'role' => $this->role->value,
            'avatar_url' => $this->avatar
                ? Storage::disk('public')->url($this->avatar)
                : null,
            'bio' => $this->bio,
            'mentor_verification_status' => $this->mentor_verification_status?->value,
            'mentor_verification_note' => $this->mentor_verification_note,
            'mentor_verified_at' => $this->mentor_verified_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
