<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->string('mentor_verification_status')->nullable()->after('bio');
            $table->text('mentor_verification_note')->nullable()->after('mentor_verification_status');
            $table->timestamp('mentor_verified_at')->nullable()->after('mentor_verification_note');
            $table->foreignId('mentor_verified_by')->nullable()->after('mentor_verified_at')
                ->constrained('users')->nullOnDelete();
        });

        DB::table('users')
            ->where('role', 'mentor')
            ->update([
                'mentor_verification_status' => 'approved',
                'mentor_verified_at' => now(),
            ]);

        Schema::create('mentor_verification_evidences', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('area_of_expertise_id')->nullable()
                ->constrained('areas_of_expertise')->nullOnDelete();
            $table->string('path');
            $table->string('original_name');
            $table->string('mime', 120)->nullable();
            $table->unsignedInteger('size')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mentor_verification_evidences');

        Schema::table('users', function (Blueprint $table): void {
            $table->dropConstrainedForeignId('mentor_verified_by');
            $table->dropColumn([
                'mentor_verification_status',
                'mentor_verification_note',
                'mentor_verified_at',
            ]);
        });
    }
};
