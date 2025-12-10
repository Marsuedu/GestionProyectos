<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;

class ProjectPolicy
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
    public function view(User $user, Project $project): bool
    {
        if (!$user->isEnabled()) {
            return false;
        }

        // Admins can view all projects
        if ($user->hasRole('Administrador')) {
            return true;
        }

        // Users can view projects they are assigned to
        return $project->users->contains($user->id);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->isEnabled() && 
               ($user->hasRole('Administrador') || $user->hasRole('Responsable de proyecto'));
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Project $project): bool
    {
        if (!$user->isEnabled()) {
            return false;
        }

        // Admins can update all projects
        if ($user->hasRole('Administrador')) {
            return true;
        }

        // Project managers can update projects they are assigned to
        return $user->hasRole('Responsable de proyecto') && 
               $project->users->contains($user->id);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Project $project): bool
    {
        if (!$user->isEnabled()) {
            return false;
        }

        // Only admins can delete projects
        return $user->hasRole('Administrador');
    }
}
