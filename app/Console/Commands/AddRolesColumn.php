<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class AddRolesColumn extends Command
{
    protected $signature = 'db:add-roles-column';
    protected $description = 'Add roles column to users table';

    public function handle()
    {
        try {
            $this->info('Checking if roles column exists...');
            
            if (Schema::hasColumn('users', 'roles')) {
                $this->info('Column roles already exists in users table');
                return 0;
            }

            $this->info('Adding roles column to users table...');
            DB::statement('ALTER TABLE users ADD COLUMN roles JSON NULL AFTER is_enabled');
            
            $this->info('Column roles added successfully to users table');
            
            // Verificar que se agregó
            if (Schema::hasColumn('users', 'roles')) {
                $this->info('Verification: roles column now exists');
            } else {
                $this->error('Verification failed: roles column still not found');
            }
            
            return 0;
        } catch (\Exception $e) {
            $this->error('Error adding roles column: ' . $e->getMessage());
            return 1;
        }
    }
}
