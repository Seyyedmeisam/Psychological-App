<?php

namespace Modules\Appointment\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;
use Modules\User\Models\User;

class MentorVerificationEvidence extends Model
{
    protected $table = 'mentor_verification_evidences';

    protected $fillable = [
        'user_id',
        'area_of_expertise_id',
        'path',
        'original_name',
        'mime',
        'size',
    ];

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<AreaOfExpertise, $this>
     */
    public function areaOfExpertise(): BelongsTo
    {
        return $this->belongsTo(AreaOfExpertise::class);
    }

    public function url(): string
    {
        return Storage::disk('public')->url($this->path);
    }
}
