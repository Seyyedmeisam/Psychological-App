<?php

namespace Modules\Appointment\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MentorAvailability extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'day_of_week',
        'start_time',
        'end_time',
    ];

    /**
     * @return BelongsTo<\Modules\User\Models\User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
