<?php

namespace Database\Seeders;

use App\Models\PromoCode;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PromoCodeSeeder extends Seeder
{
    public function run(): void
    {
        $codes = [
            ['name' => 'Promo New User', 'code' => 'WELCOME50', 'discount' => 50000],
            ['name' => 'Diskon Akhir Tahun', 'code' => 'YEAREND30', 'discount' => 30000],
            ['name' => 'Promo Flash Sale', 'code' => 'FLASH20', 'discount' => 20000],
        ];

        foreach ($codes as $code) {
            PromoCode::updateOrCreate(
                ['code' => $code['code']],
                [
                    'name' => $code['name'],
                    'discount' => $code['discount'],
                    'status' => true,
                    'image' => 'https://placehold.co/400x200?text=' . Str::slug($code['code']),
                ]
            );
        }
    }
}
