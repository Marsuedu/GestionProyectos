<?php

namespace App\Policies;

use App\Models\Task;
use App\Models\User;

class TaskPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->isEnabled();
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Task $task): bool
    {
        if (!$user->isEnabled()) {
            return false;
        }

        // Admins can view all tasks
        if ($user->hasRole('Administrador')) {
            return true;
        }

        // Users can view tasks assigned to them or tasks from their projects
        return $task->assigned_user_id === $user->id || 
               $task->project->users->contains($user->id);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->isEnabled() && 
               ($user->hasRole('Administrador') || 
                $user->hasRole('Responsable de proyecto') || 
                $user->hasRole('Responsable de tarea'));
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Task $task): bool
    {
        if (!$user->isEnabled()) {
            return false;
        }

        // Admins can update all tasks
        if ($user->hasRole('Administrador')) {
            return true;
        }

        // Project managers can update tasks from their projects
        if ($user->hasRole('Responsable de proyecto') && 
            $task->project->users->contains($user->id)) {
            return true;
        }

        // Task managers can update tasks assigned to them
        return $user->hasRole('Responsable de tarea') && 
               $task->assigned_user_id === $user->id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Task $task): bool
    {
        if (!$user->isEnabled()) {
            return false;
        }

        // Admins can delete all tasks
        if ($user->hasRole('Administrador')) {
            return true;
        }

        // Project managers can delete tasks from their projects
        return $user->hasRole('Responsable de proyecto') && 
               $task->project->users->contains($user->id);
    }

    /**
     * Determine whether the user can update task status.
     */
    public function updateStatus(User $user, Task $task): bool
    {
        if (!$user->isEnabled()) {
            return false;
        }

        // Admins can update any task status
        if ($user->hasRole('Administrador')) {
            return true;
        }

        // Users can update status of tasks assigned to them
        return $task->assigned_user_id === $user->id;
    }
}
