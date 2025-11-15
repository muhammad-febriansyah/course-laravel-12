<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Programming', 'image' => 'https://placehold.co/600x400?text=Programming'],
            ['name' => 'Design', 'image' => 'https://placehold.co/600x400?text=Design'],
            ['name' => 'Business', 'image' => 'https://placehold.co/600x400?text=Business'],
            ['name' => 'Marketing', 'image' => 'https://placehold.co/600x400?text=Marketing'],
            ['name' => 'Photography', 'image' => 'https://placehold.co/600x400?text=Photography'],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ['name' => $category['name']],
                ['image' => $category['image']]
            );
        }
    }
}
