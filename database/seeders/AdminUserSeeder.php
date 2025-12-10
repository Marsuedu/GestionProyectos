<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $adminRole = Role::where('name', 'Administrador')->first();
        
        if (!$adminRole) {
            $this->command->error('Role "Administrador" not found. Please run RoleSeeder first.');
            return;
        }

        $admin = User::firstOrCreate(
            ['email' => 'admin@proyecto.com'],
            [
                'name' => 'Administrador del Sistema',
                'password' => Hash::make('password123'),
                'phone' => '+1234567890',
                'is_enabled' => true,
                'email_verified_at' => now(),
            ]
        );

        if (!$admin->roles()->where('role_id', $adminRole->id)->exists()) {
            $admin->roles()->attach($adminRole->id);
        }

        $this->command->info('Admin user created successfully!');
        $this->command->info('Email: admin@proyecto.com');
        $this->command->info('Password: password123');
    }
}
