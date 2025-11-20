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
        Schema::table('transactions', function (Blueprint $table) {
            $table->decimal('mentor_earnings', 15, 2)->default(0)->after('total')->comment('Amount mentor will receive after platform fee');
            $table->decimal('platform_fee', 15, 2)->default(0)->after('mentor_earnings')->comment('Platform fee from this transaction');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn(['mentor_earnings', 'platform_fee']);
        });
    }
};
