<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Kelas;
use App\Models\Level;
use App\Models\Type;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Kelas>
 */
class KelasFactory extends Factory
{
    protected $model = Kelas::class;

    public function definition(): array
    {
        $title = ucfirst($this->faker->words(3, true));

        return [
            'category_id' => Category::inRandomOrder()->first()?->id ?? Category::first()->id,
            'type_id' => Type::inRandomOrder()->first()?->id ?? Type::first()->id,
            'level_id' => Level::inRandomOrder()->first()?->id ?? Level::first()->id,
            'user_id' => User::where('role', 'mentor')->inRandomOrder()->first()?->id ?? User::first()->id,
            'title' => $title,
            'price' => $this->faker->randomFloat(2, 100000, 750000),
            'discount' => $this->faker->boolean(30) ? $this->faker->randomFloat(2, 50000, 100000) : 0,
            'benefit' => collect(range(1, 4))->map(fn () => $this->faker->sentence())->implode("\n"),
            'desc' => $this->faker->paragraph(3),
            'body' => collect(range(1, 6))->map(fn () => '<p>' . $this->faker->paragraph() . '</p>')->implode("\n"),
            'image' => 'https://placehold.co/1024x576?text=' . urlencode($title),
            'status' => 1, // 1 = published, 0 = draft
            'views' => $this->faker->numberBetween(0, 5000),
        ];
    }

    public function published(): self
    {
        return $this->state(fn () => ['status' => 1]);
    }

    public function draft(): self
    {
        return $this->state(fn () => ['status' => 0]);
    }
}
