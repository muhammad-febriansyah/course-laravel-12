<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('enrollments', function (Blueprint $table) {
            $table->decimal('progress_percentage', 5, 2)->default(0)->after('status');
            $table->integer('videos_completed')->default(0)->after('progress_percentage');
            $table->integer('quizzes_completed')->default(0)->after('videos_completed');
            $table->timestamp('last_accessed_at')->nullable()->after('quizzes_completed');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('enrollments', function (Blueprint $table) {
            $table->dropColumn(['progress_percentage', 'videos_completed', 'quizzes_completed', 'last_accessed_at']);
        });
    }
};
