<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->string('stats_students_label')->nullable();
            $table->string('stats_students_value')->nullable();
            $table->string('stats_students_desc')->nullable();

            $table->string('stats_courses_label')->nullable();
            $table->string('stats_courses_value')->nullable();
            $table->string('stats_courses_desc')->nullable();

            $table->string('stats_instructors_label')->nullable();
            $table->string('stats_instructors_value')->nullable();
            $table->string('stats_instructors_desc')->nullable();

            $table->string('stats_satisfaction_label')->nullable();
            $table->string('stats_satisfaction_value')->nullable();
            $table->string('stats_satisfaction_desc')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->dropColumn([
                'stats_students_label',
                'stats_students_value',
                'stats_students_desc',
                'stats_courses_label',
                'stats_courses_value',
                'stats_courses_desc',
                'stats_instructors_label',
                'stats_instructors_value',
                'stats_instructors_desc',
                'stats_satisfaction_label',
                'stats_satisfaction_value',
                'stats_satisfaction_desc',
            ]);
        });
    }
};
