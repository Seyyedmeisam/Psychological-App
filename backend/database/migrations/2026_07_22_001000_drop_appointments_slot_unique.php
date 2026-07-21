<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Cancelled appointments kept the unique (mentor, date, start) slot occupied,
 * so clients could not rebook a freed slot. Occupancy is enforced in app code
 * for status=confirmed only.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('appointments', function (Blueprint $table): void {
            $table->dropUnique(['mentor_id', 'date', 'start_time']);
        });
    }

    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table): void {
            $table->unique(['mentor_id', 'date', 'start_time']);
        });
    }
};
