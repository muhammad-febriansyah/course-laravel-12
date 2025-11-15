<?php

namespace Database\Factories;

use App\Models\Kelas;
use App\Models\Section;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Section>
 */
class SectionFactory extends Factory
{
    protected $model = Section::class;

    public function definition(): array
    {
        return [
            'kelas_id' => Kelas::factory(),
            'title' => ucfirst($this->faker->words(3, true)),
        ];
    }

    public function forKelas(Kelas $kelas): self
    {
        return $this->state(fn () => ['kelas_id' => $kelas->id]);
    }
}
