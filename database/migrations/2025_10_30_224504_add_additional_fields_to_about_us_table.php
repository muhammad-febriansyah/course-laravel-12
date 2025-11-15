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
        Schema::table('about_us', function (Blueprint $table) {
            $table->text('vision')->nullable()->after('body');
            $table->text('mission')->nullable()->after('vision');
            $table->json('values')->nullable()->after('mission');
            $table->json('statistics')->nullable()->after('values');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('about_us', function (Blueprint $table) {
            $table->dropColumn(['vision', 'mission', 'values', 'statistics']);
        });
    }
};
