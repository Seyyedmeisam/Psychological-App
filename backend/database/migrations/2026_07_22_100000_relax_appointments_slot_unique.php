<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Cancelled appointments used to keep the unique (mentor, date, start) row,
 * which blocked rebooking the same slot. Occupancy is enforced in app code
 * for confirmed appointments only.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('appointments', function (Blueprint $table): void {
            $table->dropUnique(['mentor_id', 'date', 'start_time']);
        });

        Schema::table('appointments', function (Blueprint $table): void {
            $table->index(['mentor_id', 'date', 'start_time', 'status'], 'appointments_mentor_slot_status_index');
        });
    }

    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table): void {
            $table->dropIndex('appointments_mentor_slot_status_index');
        });

        Schema::table('appointments', function (Blueprint $table): void {
            $table->unique(['mentor_id', 'date', 'start_time']);
        });
    }
};
