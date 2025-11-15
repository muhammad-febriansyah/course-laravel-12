<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    protected array $urlMap = [
        'users' => ['/users', '/admin/users'],
        'kelas' => ['/kelas', '/admin/kelas'],
        'categories' => ['/categories', '/admin/categories'],
        'levels' => ['/levels', '/admin/levels'],
        'types' => ['/types', '/admin/types'],
        'promo_codes' => ['/promo-codes', '/admin/promo-codes'],
        'benefits' => ['/benefits', '/admin/benefits'],
        'transactions' => ['/transactions', '/admin/transactions'],
        'faqs' => ['/faqs', '/admin/faqs'],
        'website_settings' => ['/pengaturan', '/admin/pengaturan'],
        'term_conditions' => ['/term-conditions', '/admin/term-conditions'],
        'privacy_policy' => ['/kebijakan-privasi', '/admin/kebijakan-privasi'],
    ];

    public function up(): void
    {
        if (! Schema::hasTable('menus')) {
            return;
        }

        foreach ($this->urlMap as $name => $urls) {
            [$old, $new] = $urls;
            DB::table('menus')
                ->where('name', $name)
                ->where(function ($query) use ($old) {
                    $query->where('url', $old)->orWhereNull('url');
                })
                ->update(['url' => $new, 'updated_at' => now()]);
        }
    }

    public function down(): void
    {
        if (! Schema::hasTable('menus')) {
            return;
        }

        foreach ($this->urlMap as $name => $urls) {
            [$old, $new] = $urls;
            DB::table('menus')
                ->where('name', $name)
                ->where('url', $new)
                ->update(['url' => $old, 'updated_at' => now()]);
        }
    }
};
