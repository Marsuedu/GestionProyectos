<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // A. Crear Usuario Admin específico
        $this->command->info('Creando usuario Admin...');
        
        $admin = User::firstOrCreate(
            ['email' => 'admin@proyecto.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password'),
                'phone' => '+1234567890',
                'is_active' => true,
                'roles' => ['Administrador'],
                'email_verified_at' => now(),
            ]
        );
        
        $this->command->info('Usuario Admin creado: admin@proyecto.com / password');

        // B. Crear 10 Usuarios Random
        $this->command->info('Creando 10 usuarios aleatorios...');
        $randomUsers = User::factory()->count(10)->create();
        $this->command->info('Usuarios aleatorios creados');

        // C. Crear 5 Proyectos y sus Tareas
        $this->command->info('Creando 5 proyectos con 5 tareas cada uno...');
        
        $allUsers = $randomUsers->concat([$admin]);
        
        Project::factory()
            ->count(5)
            ->create(['created_by' => $admin->id])
            ->each(function ($project) use ($allUsers) {
                // Por cada proyecto, crear 5 tareas asignadas aleatoriamente
                Task::factory()
                    ->count(5)
                    ->create([
                        'project_id' => $project->id,
                        'assigned_user_id' => $allUsers->random()->id,
                    ]);
            });
        
        $this->command->info('Proyectos y tareas creados exitosamente');
        $this->command->info('Base de datos poblada con datos de prueba realistas');
    }
}
