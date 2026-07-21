<?php

namespace Modules\Chat\Services;

use App\Enums\UserRole;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Modules\Appointment\Models\Appointment;
use Modules\Chat\Models\Conversation;
use Modules\Chat\Models\Message;
use Modules\User\Models\User;

class ChatService
{
    private const MAX_BYTES = 5 * 1024 * 1024;

    public function listConversations(User $user): Collection
    {
        return Conversation::query()
            ->where(function ($query) use ($user) {
                $query->where('user_low_id', $user->id)
                    ->orWhere('user_high_id', $user->id);
            })
            ->with([
                'lowUser:id,name,role,avatar',
                'highUser:id,name,role,avatar',
                'latestMessage',
            ])
            ->orderByDesc('last_message_at')
            ->orderByDesc('id')
            ->get();
    }

    public function listPeople(User $user, ?string $search = null): Collection
    {
        $query = User::query()
            ->where('id', '!=', $user->id)
            ->orderBy('name');

        if ($user->role === UserRole::User) {
            $query->whereIn('role', [UserRole::Mentor, UserRole::Admin]);
        } elseif ($user->role === UserRole::Mentor) {
            $patientIds = Appointment::query()
                ->where('mentor_id', $user->id)
                ->distinct()
                ->pluck('client_id');

            $query->where(function ($inner) use ($patientIds) {
                $inner->whereIn('id', $patientIds)
                    ->orWhere('role', UserRole::Admin);
            });
        }

        if ($search) {
            $term = '%'.$search.'%';
            $query->where(function ($inner) use ($term) {
                $inner->where('name', 'like', $term)
                    ->orWhere('mobile', 'like', $term);
            });
        }

        return $query->limit(50)->get(['id', 'name', 'role', 'avatar', 'mobile']);
    }

    public function findOrCreate(User $user, int $otherUserId): Conversation
    {
        if ($otherUserId === $user->id) {
            throw ValidationException::withMessages([
                'user_id' => ['You cannot chat with yourself.'],
            ]);
        }

        $other = User::query()->findOrFail($otherUserId);
        $this->assertCanChat($user, $other);

        $pair = Conversation::pairIds($user->id, $other->id);

        return Conversation::query()->firstOrCreate($pair);
    }

    public function getConversationFor(User $user, int $conversationId): Conversation
    {
        $conversation = Conversation::query()->findOrFail($conversationId);

        if (! $conversation->includesUser($user->id)) {
            abort(403, 'You are not part of this conversation.');
        }

        return $conversation;
    }

    public function listMessages(Conversation $conversation, ?int $afterId = null): Collection
    {
        $query = Message::query()
            ->where('conversation_id', $conversation->id)
            ->with('sender:id,name,role,avatar')
            ->orderBy('id');

        if ($afterId) {
            $query->where('id', '>', $afterId);
        }

        return $query->limit(200)->get();
    }

    public function sendMessage(
        User $sender,
        Conversation $conversation,
        ?string $body,
        ?UploadedFile $file = null,
    ): Message {
        if (! $conversation->includesUser($sender->id)) {
            abort(403, 'You are not part of this conversation.');
        }

        $trimmed = $body !== null ? trim($body) : '';
        if ($trimmed === '' && ! $file) {
            throw ValidationException::withMessages([
                'body' => ['Message text or an attachment is required.'],
            ]);
        }

        $attachment = $file ? $this->storeAttachment($file) : null;

        return DB::transaction(function () use ($sender, $conversation, $trimmed, $attachment) {
            $message = Message::query()->create([
                'conversation_id' => $conversation->id,
                'sender_id' => $sender->id,
                'body' => $trimmed !== '' ? $trimmed : null,
                'attachment_path' => $attachment['path'] ?? null,
                'attachment_type' => $attachment['type'] ?? null,
                'attachment_name' => $attachment['name'] ?? null,
                'attachment_mime' => $attachment['mime'] ?? null,
                'attachment_size' => $attachment['size'] ?? null,
            ]);

            $conversation->update(['last_message_at' => now()]);

            return $message->load('sender:id,name,role,avatar');
        });
    }

    /**
     * @return array{path: string, type: string, name: string, mime: string, size: int}
     */
    private function storeAttachment(UploadedFile $file): array
    {
        if ($file->getSize() > self::MAX_BYTES) {
            throw ValidationException::withMessages([
                'attachment' => ['File must be 5MB or smaller.'],
            ]);
        }

        $mime = (string) $file->getMimeType();
        $type = $this->resolveAttachmentType($mime);

        $path = $file->store('chat', 'public');

        return [
            'path' => $path,
            'type' => $type,
            'name' => $file->getClientOriginalName(),
            'mime' => $mime,
            'size' => (int) $file->getSize(),
        ];
    }

    private function resolveAttachmentType(string $mime): string
    {
        if (str_starts_with($mime, 'image/')) {
            return 'image';
        }

        if (str_starts_with($mime, 'audio/')) {
            return 'audio';
        }

        return 'file';
    }

    private function assertCanChat(User $user, User $other): void
    {
        if ($user->role === UserRole::Admin || $other->role === UserRole::Admin) {
            return;
        }

        if ($user->role === UserRole::User && $other->role === UserRole::Mentor) {
            return;
        }

        if ($user->role === UserRole::Mentor && $other->role === UserRole::User) {
            $hasAppointment = Appointment::query()
                ->where('mentor_id', $user->id)
                ->where('client_id', $other->id)
                ->exists();

            if ($hasAppointment) {
                return;
            }
        }

        throw ValidationException::withMessages([
            'user_id' => ['You can only chat with your patients.'],
        ]);
    }
}
