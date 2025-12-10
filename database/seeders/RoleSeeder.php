<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            [
                'name' => 'Administrador',
                'description' => 'Acceso completo al sistema, puede gestionar usuarios, proyectos y tareas.',
            ],
            [
                'name' => 'Responsable de proyecto',
                'description' => 'Puede crear y gestionar proyectos, asignar usuarios y crear tareas.',
            ],
            [
                'name' => 'Responsable de tarea',
                'description' => 'Puede actualizar el estado de las tareas asignadas.',
            ],
        ];

        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role['name']], $role);
        }
    }
}
