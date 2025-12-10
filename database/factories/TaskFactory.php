<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Task> */
class TaskFactory extends Factory
{
    protected $model = Task::class;

    public function definition(): array
    {
        $startDate = fake()->dateTimeBetween('-1 month', 'now');
        $endDate = fake()->dateTimeBetween($startDate, '+3 months');
        
        return [
            'title' => fake()->sentence(4),
            'description' => fake()->paragraph(3),
            'start_date' => $startDate,
            'end_date' => $endDate,
            'status' => fake()->randomElement(['Pendiente', 'En Progreso', 'Completado']),
            'priority' => fake()->randomElement(['Baja', 'Media', 'Alta']),
            'project_id' => Project::inRandomOrder()->first()->id,
            'assigned_user_id' => User::inRandomOrder()->first()->id,
            'created_by' => User::inRandomOrder()->first()->id,
        ];
    }
}
