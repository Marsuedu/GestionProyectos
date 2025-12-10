<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
    ];

    /**
     * Relationships
     */
    public function users()
    {
        return $this->belongsToMany(User::class, 'user_roles');
    }

    /**
     * Role constants
     */
    const ADMIN = 'Administrador';
    const PROJECT_MANAGER = 'Responsable de proyecto';
    const TASK_MANAGER = 'Responsable de tarea';
}
