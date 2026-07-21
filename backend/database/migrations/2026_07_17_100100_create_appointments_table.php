<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('mentor_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('area_of_expertise_id')->constrained('areas_of_expertise')->restrictOnDelete();
            $table->date('date');
            $table->string('start_time', 5);
            $table->string('end_time', 5);
            $table->string('status')->default('confirmed');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['mentor_id', 'date', 'start_time']);
            $table->index(['client_id', 'date']);
            $table->index(['area_of_expertise_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
