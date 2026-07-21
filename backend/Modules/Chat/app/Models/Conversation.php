<?php

namespace Modules\Chat\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Modules\User\Models\User;

class Conversation extends Model
{
    protected $fillable = [
        'user_low_id',
        'user_high_id',
        'last_message_at',
    ];

    protected function casts(): array
    {
        return [
            'last_message_at' => 'datetime',
        ];
    }

    public function lowUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_low_id');
    }

    public function highUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_high_id');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    public function latestMessage(): HasOne
    {
        return $this->hasOne(Message::class)->latestOfMany();
    }

    public function otherUserId(int $userId): int
    {
        return $this->user_low_id === $userId
            ? (int) $this->user_high_id
            : (int) $this->user_low_id;
    }

    public function includesUser(int $userId): bool
    {
        return $this->user_low_id === $userId || $this->user_high_id === $userId;
    }

    public static function pairIds(int $a, int $b): array
    {
        return $a < $b
            ? ['user_low_id' => $a, 'user_high_id' => $b]
            : ['user_low_id' => $b, 'user_high_id' => $a];
    }
}
