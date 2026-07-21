<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Counseling session schedule template
    |--------------------------------------------------------------------------
    |
    | Each session lasts 90 minutes and is followed by a 15-minute break.
    | Slots run from 07:00 through 19:00 (last slot ends at 19:00).
    |
    */

    'day_start' => '07:00',
    'day_end' => '19:00',
    'session_minutes' => 90,
    'break_minutes' => 15,

    'slots' => [
        ['start' => '07:00', 'end' => '08:30'],
        ['start' => '08:45', 'end' => '10:15'],
        ['start' => '10:30', 'end' => '12:00'],
        ['start' => '12:15', 'end' => '13:45'],
        ['start' => '14:00', 'end' => '15:30'],
        ['start' => '15:45', 'end' => '17:15'],
        ['start' => '17:30', 'end' => '19:00'],
    ],

];
