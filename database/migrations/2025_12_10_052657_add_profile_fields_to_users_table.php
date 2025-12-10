<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
public function up(): void
{
    Schema::table('users', function (Blueprint $table) {
        // Solo agrega 'phone' si NO existe
        if (!Schema::hasColumn('users', 'phone')) {
            $table->string('phone')->nullable()->after('email');
        }
        
        // Solo agrega 'is_active' si NO existe
        if (!Schema::hasColumn('users', 'is_active')) {
            $table->boolean('is_active')->default(true)->after('phone');
        }

        // Solo agrega 'roles' si NO existe
        if (!Schema::hasColumn('users', 'roles')) {
            $table->json('roles')->nullable()->after('is_active');
        }
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
{
    Schema::table('users', function (Blueprint $table) {
        $table->dropColumn(['phone', 'is_active', 'roles']);
    });
}
};
