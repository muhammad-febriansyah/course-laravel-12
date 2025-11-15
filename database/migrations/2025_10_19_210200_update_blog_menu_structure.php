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

        $blogMenu = DB::table('menus')->where('name', 'news')->first();
        $maxOrder = (int) DB::table('menus')->max('order');

        if (! $blogMenu) {
            $blogMenuId = DB::table('menus')->insertGetId([
                'name' => 'news',
                'title' => 'Blog',
                'url' => null,
                'icon' => 'file_text',
                'parent_id' => null,
                'order' => $maxOrder + 1,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } else {
            $blogMenuId = $blogMenu->id;

            DB::table('menus')
                ->where('id', $blogMenuId)
                ->update([
                    'url' => null,
                    'parent_id' => null,
                    'icon' => 'file_text',
                    'order' => $blogMenu->order ?? $maxOrder,
                    'updated_at' => now(),
                ]);
        }

        $postsExists = DB::table('menus')->where('name', 'news_posts')->exists();

        if (! $postsExists) {
            DB::table('menus')->insert([
                'name' => 'news_posts',
                'title' => 'Artikel',
                'url' => '/admin/news',
                'icon' => 'file_text',
                'parent_id' => $blogMenuId,
                'order' => 1,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $categoriesExists = DB::table('menus')->where('name', 'news_categories')->exists();

        if (! $categoriesExists) {
            DB::table('menus')->insert([
                'name' => 'news_categories',
                'title' => 'Kategori Blog',
                'url' => '/admin/news-categories',
                'icon' => 'category',
                'parent_id' => $blogMenuId,
                'order' => 2,
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

        DB::table('menus')->whereIn('name', ['news_posts', 'news_categories'])->delete();

        DB::table('menus')
            ->where('name', 'news')
            ->update([
                'url' => '/admin/news',
                'icon' => 'file_text',
                'updated_at' => now(),
            ]);
    }
};
