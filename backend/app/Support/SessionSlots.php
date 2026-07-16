<?php

namespace App\Support;

class SessionSlots
{
    /**
     * @return list<array{start: string, end: string}>
     */
    public static function all(): array
    {
        /** @var list<array{start: string, end: string}> $slots */
        $slots = config('sessions.slots', []);

        return $slots;
    }

    /**
     * @return list<string>
     */
    public static function startTimes(): array
    {
        return array_map(static fn (array $slot) => $slot['start'], self::all());
    }

    public static function endTimeFor(string $start): ?string
    {
        foreach (self::all() as $slot) {
            if ($slot['start'] === $start) {
                return $slot['end'];
            }
        }

        return null;
    }

    public static function isValidStart(string $start): bool
    {
        return in_array($start, self::startTimes(), true);
    }
}
