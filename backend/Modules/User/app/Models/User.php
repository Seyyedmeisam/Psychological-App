<?php

namespace Modules\User\Models;

use App\Enums\MentorVerificationStatus;
use App\Enums\UserRole;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Modules\Appointment\Models\Appointment;
use Modules\Appointment\Models\AppointmentRating;
use Modules\Appointment\Models\AreaOfExpertise;
use Modules\Appointment\Models\MentorAvailability;
use Modules\Appointment\Models\MentorVerificationEvidence;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    protected static function newFactory(): UserFactory
    {
        return UserFactory::new();
    }

    /**
     * @return HasMany<MentorAvailability, $this>
     */
    public function availabilities(): HasMany
    {
        return $this->hasMany(MentorAvailability::class);
    }

    /**
     * @return BelongsToMany<AreaOfExpertise, $this>
     */
    public function areasOfExpertise(): BelongsToMany
    {
        return $this->belongsToMany(AreaOfExpertise::class)
            ->withTimestamps();
    }

    /**
     * @return HasMany<Appointment, $this>
     */
    public function clientAppointments(): HasMany
    {
        return $this->hasMany(Appointment::class, 'client_id');
    }

    /**
     * @return HasMany<Appointment, $this>
     */
    public function mentorAppointments(): HasMany
    {
        return $this->hasMany(Appointment::class, 'mentor_id');
    }

    /**
     * @return HasMany<AppointmentRating, $this>
     */
    public function receivedRatings(): HasMany
    {
        return $this->hasMany(AppointmentRating::class, 'mentor_id');
    }

    /**
     * @return HasMany<MentorVerificationEvidence, $this>
     */
    public function verificationEvidences(): HasMany
    {
        return $this->hasMany(MentorVerificationEvidence::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function mentorVerifiedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'mentor_verified_by');
    }

    public function isApprovedMentor(): bool
    {
        return $this->role === UserRole::Mentor
            && $this->mentor_verification_status === MentorVerificationStatus::Approved;
    }

    /**
     * @param  Builder<User>  $query
     * @return Builder<User>
     */
    public function scopeApprovedMentors(Builder $query): Builder
    {
        return $query
            ->where('role', UserRole::Mentor)
            ->where('mentor_verification_status', MentorVerificationStatus::Approved);
    }

    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'mobile',
        'email',
        'password',
        'role',
        'avatar',
        'bio',
        'mentor_verification_status',
        'mentor_verification_note',
        'mentor_verified_at',
        'mentor_verified_by',
    ];

    /**
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => UserRole::class,
            'mentor_verification_status' => MentorVerificationStatus::class,
            'mentor_verified_at' => 'datetime',
        ];
    }
}
