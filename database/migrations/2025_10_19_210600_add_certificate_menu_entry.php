<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('menus')) {
            return;
        }

        $certificateMenu = DB::table('menus')->where('name', 'certificates')->first();

        if (! $certificateMenu) {
            $maxOrder = (int) DB::table('menus')->max('order');

            DB::table('menus')->insert([
                'name' => 'certificates',
                'title' => 'Sertifikat',
                'url' => '/admin/certificates',
                'icon' => 'award',
                'parent_id' => null,
                'order' => $maxOrder + 1,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        if (! Schema::hasTable('menus')) {
            return;
        }

        DB::table('menus')->where('name', 'certificates')->delete();
    }
};
