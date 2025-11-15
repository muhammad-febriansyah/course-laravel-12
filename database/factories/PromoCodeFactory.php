<?php

namespace Database\Factories;

use App\Models\PromoCode;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<PromoCode>
 */
class PromoCodeFactory extends Factory
{
    protected $model = PromoCode::class;

    public function definition(): array
    {
        $name = ucfirst($this->faker->words(2, true));

        return [
            'name' => $name,
            'code' => Str::upper(Str::slug($name)) . $this->faker->numberBetween(10, 99),
            'discount' => $this->faker->numberBetween(10, 50),
            'status' => true,
            'image' => 'https://placehold.co/400x200?text=' . urlencode($name),
        ];
    }
}
