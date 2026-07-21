<?php

namespace Modules\Appointment\Models;

use Modules\User\Models\User;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class AreaOfExpertise extends Model
{
    use HasFactory;

    protected $table = 'areas_of_expertise';

    /**
     * @var list<string>
     */
    protected $fillable = [
        'slug',
        'name',
        'name_en',
        'description',
        'is_active',
        'sort_order',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    /**
     * @return BelongsToMany<\Modules\User\Models\User, $this>
     */
    public function mentors(): BelongsToMany
    {
        return $this->belongsToMany(User::class)
            ->withTimestamps();
    }
}
