<?php

namespace Modules\Chat\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \Modules\Chat\Models\Message */
class MessageResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'conversation_id' => $this->conversation_id,
            'sender_id' => $this->sender_id,
            'sender' => new ChatUserResource($this->whenLoaded('sender')),
            'body' => $this->body,
            'attachment' => $this->attachment_path ? [
                'url' => $this->attachmentUrl(),
                'type' => $this->attachment_type,
                'name' => $this->attachment_name,
                'mime' => $this->attachment_mime,
                'size' => $this->attachment_size,
            ] : null,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
