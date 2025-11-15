<?php

namespace Database\Factories;

use App\Models\Kelas;
use App\Models\Quiz;
use App\Models\QuizAnswer;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Quiz>
 */
class QuizFactory extends Factory
{
    protected $model = Quiz::class;

    public function definition(): array
    {
        return [
            'kelas_id' => Kelas::factory(),
            'question' => ucfirst($this->faker->sentence(8)),
            'image' => null,
            'point' => $this->faker->numberBetween(10, 25),
        ];
    }

    public function forKelas(Kelas $kelas): self
    {
        return $this->state(fn () => ['kelas_id' => $kelas->id]);
    }

    public function configure(): static
    {
        return $this->afterCreating(function (Quiz $quiz): void {
            $options = collect(range(0, 3))->map(fn () => $this->faker->sentence(3))->all();
            $correctOption = $options[$this->faker->numberBetween(0, count($options) - 1)];

            foreach ($options as $option) {
                QuizAnswer::updateOrCreate(
                    [
                        'quiz_id' => $quiz->id,
                        'answer' => $option,
                    ],
                    [
                        'point' => $option === $correctOption ? $quiz->point : 0,
                    ],
                );
            }
        });
    }
}
