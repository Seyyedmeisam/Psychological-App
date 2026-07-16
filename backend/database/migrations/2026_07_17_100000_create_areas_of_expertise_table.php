<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('areas_of_expertise', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('name_en')->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('area_of_expertise_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('area_of_expertise_id')->constrained('areas_of_expertise')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['user_id', 'area_of_expertise_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('area_of_expertise_user');
        Schema::dropIfExists('areas_of_expertise');
    }
};
