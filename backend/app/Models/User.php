<?php

namespace App\Models;

use App\Enums\UserRole;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

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
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'mobile',
        'email',
        'password',
        'role',
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
        ];
    }
}
