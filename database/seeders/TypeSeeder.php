<?php

namespace Database\Seeders;

use App\Models\Type;
use Illuminate\Database\Seeder;

class TypeSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            ['name' => 'Self-paced', 'image' => 'https://placehold.co/600x400?text=Self-paced'],
            ['name' => 'Bootcamp', 'image' => 'https://placehold.co/600x400?text=Bootcamp'],
            ['name' => 'Webinar', 'image' => 'https://placehold.co/600x400?text=Webinar'],
        ];

        foreach ($types as $type) {
            Type::updateOrCreate(
                ['name' => $type['name']],
                ['image' => $type['image']]
            );
        }
    }
}
