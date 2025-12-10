<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'is_active', // Coincide con tu base de datos
        'roles',     // Coincide con tu columna JSON
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'roles' => 'array', // <--- ESTO ES VITAL: Convierte el JSON a Array y viceversa
        ];
    }

    /**
     * Relationships
     */
    
    // ❌ HE BORRADO public function roles() 
    // Porque ahora 'roles' es una columna, no una tabla relacionada.

    public function projects()
    {
        return $this->belongsToMany(Project::class, 'project_users');
    }

    public function assignedTasks()
    {
        return $this->hasMany(Task::class, 'assigned_user_id');
    }

    public function createdProjects()
    {
        return $this->hasMany(Project::class, 'created_by');
    }

    public function createdTasks()
    {
        return $this->hasMany(Task::class, 'created_by');
    }

    /**
     * Check if user has a specific role
     * ✅ CORREGIDO: Ahora busca dentro del Array JSON
     */
    public function hasRole(string $roleName): bool
    {
        // Si roles es null, usamos array vacío para evitar error
        return in_array($roleName, $this->roles ?? []);
    }

    /**
     * Check if user is enabled
     * ✅ CORREGIDO: El nombre correcto de la columna es is_active
     */
    public function isEnabled(): bool
    {
        return $this->is_active;
    }
}