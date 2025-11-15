<?php

namespace Database\Factories;

use App\Models\Section;
use App\Models\Video;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Video>
 */
class VideoFactory extends Factory
{
    protected $model = Video::class;

    public function definition(): array
    {
        $title = ucfirst($this->faker->words(4, true));
        $videoId = $this->faker->bothify('###########');

        return [
            'section_id' => Section::factory(),
            'title' => $title,
            'video' => "https://youtu.be/{$videoId}",
        ];
    }

    public function forSection(Section $section): self
    {
        return $this->state(fn () => ['section_id' => $section->id]);
    }
}
