<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Project> */
class ProjectFactory extends Factory
{
    protected $model = Project::class;

    public function definition(): array
    {
        $startDate = fake()->dateTimeBetween('-1 month', 'now');
        $endDate = fake()->dateTimeBetween($startDate, '+6 months');
        
        return [
            'title' => fake()->sentence(4),
            'description' => fake()->paragraph(3),
            'start_date' => $startDate,
            'end_date' => $endDate,
            'status' => fake()->randomElement(['Pendiente', 'En Progreso', 'Completado']),
            'created_by' => User::inRandomOrder()->first()->id,
        ];
    }
}
