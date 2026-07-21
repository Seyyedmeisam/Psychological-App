<?php

namespace App\Enums;

enum AppointmentStatus: string
{
    case Confirmed = 'confirmed';
    case Cancelled = 'cancelled';
    case UserAbsent = 'user_absent';
    case MentorAbsent = 'mentor_absent';

    /**
     * @return list<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public function occupiesSlot(): bool
    {
        return $this === self::Confirmed;
    }
}
