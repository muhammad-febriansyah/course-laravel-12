<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasTable('menus')) {
            return;
        }

        // Check if about us menu already exists
        $aboutUsExists = DB::table('menus')->where('name', 'about_us')->exists();

        if (!$aboutUsExists) {
            // Get max order to place it at the end
            $maxOrder = (int) DB::table('menus')->max('order');

            DB::table('menus')->insert([
                'name' => 'about_us',
                'title' => 'Tentang Kami',
                'url' => '/admin/about-us',
                'icon' => 'info',
                'parent_id' => null,
                'order' => $maxOrder + 1,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (!Schema::hasTable('menus')) {
            return;
        }

        DB::table('menus')->where('name', 'about_us')->delete();
    }
};
