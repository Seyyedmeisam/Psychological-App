<?php

namespace Modules\Chat\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

/** @mixin \Modules\User\Models\User */
class ChatUserResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'role' => $this->role?->value ?? $this->role,
            'avatar_url' => $this->avatar
                ? Storage::disk('public')->url($this->avatar)
                : null,
        ];
    }
}
