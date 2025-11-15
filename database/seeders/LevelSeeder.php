<?php

namespace Database\Seeders;

use App\Models\Level;
use Illuminate\Database\Seeder;

class LevelSeeder extends Seeder
{
    public function run(): void
    {
        $levels = [
            ['name' => 'Beginner', 'image' => 'https://placehold.co/600x400?text=Beginner'],
            ['name' => 'Intermediate', 'image' => 'https://placehold.co/600x400?text=Intermediate'],
            ['name' => 'Advanced', 'image' => 'https://placehold.co/600x400?text=Advanced'],
        ];

        foreach ($levels as $level) {
            Level::updateOrCreate(
                ['name' => $level['name']],
                ['image' => $level['image']]
            );
        }
    }
}
