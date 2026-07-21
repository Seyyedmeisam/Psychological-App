<?php

require_once __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

if (! $app->environment('production')) {

    $kernel->call('migrate', ['--force' => true]);
    echo nl2br($kernel->output());

    $kernel->call('db:seed', ['--force' => true]);
    echo nl2br($kernel->output());

} else {
    echo 'This script is disabled in production environment.';
}