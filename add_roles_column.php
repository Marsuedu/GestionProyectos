<?php

require_once __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    // Verificar si la columna existe
    $columns = \Illuminate\Support\Facades\Schema::getColumnListing('users');
    echo "Current columns in users table: " . implode(', ', $columns) . "\n";
    
    if (in_array('roles', $columns)) {
        echo "Column 'roles' already exists!\n";
    } else {
        echo "Adding 'roles' column...\n";
        \Illuminate\Support\Facades\DB::statement('ALTER TABLE users ADD COLUMN roles JSON NULL AFTER is_enabled');
        
        // Verificar nuevamente
        $columns = \Illuminate\Support\Facades\Schema::getColumnListing('users');
        if (in_array('roles', $columns)) {
            echo "Column 'roles' added successfully!\n";
        } else {
            echo "Failed to add column 'roles'\n";
        }
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
