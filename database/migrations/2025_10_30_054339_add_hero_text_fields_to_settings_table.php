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
        Schema::table('settings', function (Blueprint $table) {
            $table->string('hero_title')->nullable()->after('home_thumbnail');
            $table->text('hero_subtitle')->nullable()->after('hero_title');
            $table->string('hero_stat1_number')->nullable()->after('hero_subtitle');
            $table->string('hero_stat1_label')->nullable()->after('hero_stat1_number');
            $table->string('hero_stat2_number')->nullable()->after('hero_stat1_label');
            $table->string('hero_stat2_label')->nullable()->after('hero_stat2_number');
            $table->string('hero_stat3_number')->nullable()->after('hero_stat2_label');
            $table->string('hero_stat3_label')->nullable()->after('hero_stat3_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->dropColumn([
                'hero_title',
                'hero_subtitle',
                'hero_stat1_number',
                'hero_stat1_label',
                'hero_stat2_number',
                'hero_stat2_label',
                'hero_stat3_number',
                'hero_stat3_label',
            ]);
        });
    }
};
