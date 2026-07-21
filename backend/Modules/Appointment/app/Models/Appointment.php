<?php

namespace Modules\Appointment\Models;

use App\Enums\AppointmentStatus;
use Modules\User\Models\User;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Appointment extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'client_id',
        'mentor_id',
        'area_of_expertise_id',
        'date',
        'start_time',
        'end_time',
        'status',
        'notes',
        'meeting_url',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'date' => 'date',
        ];
    }

    /**
     * @return BelongsTo<\Modules\User\Models\User, $this>
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    /**
     * @return BelongsTo<\Modules\User\Models\User, $this>
     */
    public function mentor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'mentor_id');
    }

    /**
     * @return BelongsTo<AreaOfExpertise, $this>
     */
    public function areaOfExpertise(): BelongsTo
    {
        return $this->belongsTo(AreaOfExpertise::class);
    }

    /**
     * @return HasOne<AppointmentRating, $this>
     */
    public function rating(): HasOne
    {
        return $this->hasOne(AppointmentRating::class);
    }

    public function isPast(): bool
    {
        $date = $this->date instanceof \Carbon\Carbon
            ? $this->date->toDateString()
            : (string) $this->date;

        $endsAt = \Carbon\Carbon::parse("{$date} {$this->end_time}");

        return $endsAt->isPast();
    }

    public function statusEnum(): AppointmentStatus
    {
        return AppointmentStatus::tryFrom((string) $this->status)
            ?? AppointmentStatus::Confirmed;
    }

    public function occupiesSlot(): bool
    {
        return $this->statusEnum()->occupiesSlot();
    }

    public function isCompleted(): bool
    {
        return $this->statusEnum() === AppointmentStatus::Confirmed && $this->isPast();
    }

    public function sessionStartsAt(): \Carbon\Carbon
    {
        $date = $this->date instanceof \Carbon\Carbon
            ? $this->date->toDateString()
            : (string) $this->date;

        return \Carbon\Carbon::parse("{$date} {$this->start_time}");
    }

    public function sessionEndsAt(): \Carbon\Carbon
    {
        $date = $this->date instanceof \Carbon\Carbon
            ? $this->date->toDateString()
            : (string) $this->date;

        return \Carbon\Carbon::parse("{$date} {$this->end_time}");
    }

    public function isInSessionWindow(): bool
    {
        if ($this->statusEnum() !== AppointmentStatus::Confirmed) {
            return false;
        }

        $now = \Carbon\Carbon::now();

        return $now->greaterThanOrEqualTo($this->sessionStartsAt())
            && $now->lessThanOrEqualTo($this->sessionEndsAt());
    }

    /** Clients/mentors may join 15 minutes before start through session end. */
    public function canJoinMeeting(): bool
    {
        if ($this->statusEnum() !== AppointmentStatus::Confirmed) {
            return false;
        }

        $now = \Carbon\Carbon::now();
        $joinFrom = $this->sessionStartsAt()->copy()->subMinutes(15);

        return $now->greaterThanOrEqualTo($joinFrom)
            && $now->lessThanOrEqualTo($this->sessionEndsAt());
    }
}
