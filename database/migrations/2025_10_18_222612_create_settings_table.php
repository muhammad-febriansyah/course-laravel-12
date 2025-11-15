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
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('site_name');
            $table->string('keyword');
            $table->string('email');
            $table->string('address');
            $table->string('phone');
            $table->text('desc');
            $table->string('yt');
            $table->string('ig');
            $table->string('tiktok');
            $table->string('fb');
            $table->string('logo');
            $table->string('favicon');
            $table->string('thumbnail');
            $table->string('fee');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
