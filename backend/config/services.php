<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'google' => [
        'meet' => [
            // dev: stable per-appointment link (synthetic meet code) or dev_room_url
            // spaces: Google Meet API (service account)
            // calendar: Google Calendar conference (service account)
            'mode' => env('GOOGLE_MEET_MODE', 'dev'),
            'service_account_json' => env('GOOGLE_SERVICE_ACCOUNT_JSON'),
            'impersonate' => env('GOOGLE_CALENDAR_IMPERSONATE'),
            'calendar_id' => env('GOOGLE_CALENDAR_ID', 'primary'),
            'dev_room_url' => env('GOOGLE_MEET_DEV_ROOM_URL'),
        ],
    ],

];
