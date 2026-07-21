<?php

namespace Modules\Chat\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Modules\User\Models\User;

/** @mixin \Modules\Chat\Models\Conversation */
class ConversationResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var User $me */
        $me = $request->user();
        $other = $this->user_low_id === $me->id
            ? $this->highUser
            : $this->lowUser;

        return [
            'id' => $this->id,
            'other_user' => new ChatUserResource($other),
            'last_message' => $this->when(
                $this->relationLoaded('latestMessage') && $this->latestMessage,
                fn () => new MessageResource($this->latestMessage),
            ),
            'last_message_at' => $this->last_message_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
