<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class AddRolesColumnSeeder extends Seeder
{
    public function run()
    {
        try {
            // Verificar si la columna existe
            $columns = Schema::getColumnListing('users');
            $this->command->info('Current columns in users table: ' . implode(', ', $columns));
            
            if (in_array('roles', $columns)) {
                $this->command->info('Column "roles" already exists!');
            } else {
                $this->command->info('Adding "roles" column...');
                DB::statement('ALTER TABLE users ADD COLUMN roles JSON NULL AFTER is_enabled');
                
                // Verificar nuevamente
                $columns = Schema::getColumnListing('users');
                if (in_array('roles', $columns)) {
                    $this->command->info('Column "roles" added successfully!');
                } else {
                    $this->command->error('Failed to add column "roles"');
                }
            }
        } catch (Exception $e) {
            $this->command->error('Error: ' . $e->getMessage());
        }
    }
}
