<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        // Verificación de perfil completo desactivada temporalmente
        // if (!$user->phone || !$user->roles || empty($user->roles)) {
        //     return Redirect::route('profile.complete');
        // }
        
        $stats = [
            'total_projects' => $this->getTotalProjects($user),
            'total_tasks' => $this->getTotalTasks($user),
            'pending_tasks' => $this->getPendingTasks($user),
            'completed_tasks' => $this->getCompletedTasks($user),
        ];

        $recentProjects = $this->getRecentProjects($user);
        $myTasks = $this->getMyTasks($user);
        $tasksByProject = $this->getTasksByProject($user);

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'recentProjects' => $recentProjects,
            'myTasks' => $myTasks,
            'tasksByProject' => $tasksByProject,
        ]);
    }

    private function getTotalProjects($user)
    {
        $query = Project::query();
        
        if (!$user->hasRole('Administrador')) {
            $query->whereHas('users', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            });
        }
        
        return $query->count();
    }

    private function getTotalTasks($user)
    {
        $query = Task::query();
        
        if (!$user->hasRole('Administrador')) {
            $query->where(function ($q) use ($user) {
                $q->where('assigned_user_id', $user->id)
                  ->orWhereHas('project.users', function ($subQ) use ($user) {
                      $subQ->where('user_id', $user->id);
                  });
            });
        }
        
        return $query->count();
    }

    private function getPendingTasks($user)
    {
        $query = Task::where('status', 'pending');
        
        if (!$user->hasRole('Administrador')) {
            $query->where(function ($q) use ($user) {
                $q->where('assigned_user_id', $user->id)
                  ->orWhereHas('project.users', function ($subQ) use ($user) {
                      $subQ->where('user_id', $user->id);
                  });
            });
        }
        
        return $query->count();
    }

    private function getCompletedTasks($user)
    {
        $query = Task::where('status', 'completed');
        
        if (!$user->hasRole('Administrador')) {
            $query->where(function ($q) use ($user) {
                $q->where('assigned_user_id', $user->id)
                  ->orWhereHas('project.users', function ($subQ) use ($user) {
                      $subQ->where('user_id', $user->id);
                  });
            });
        }
        
        return $query->count();
    }

    private function getRecentProjects($user)
    {
        $query = Project::with(['creator', 'users'])
            ->orderBy('created_at', 'desc')
            ->limit(5);
        
        if (!$user->hasRole('Administrador')) {
            $query->whereHas('users', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            });
        }
        
        return $query->get();
    }

    private function getMyTasks($user)
    {
        return Task::with(['project', 'assignedUser'])
            ->where('assigned_user_id', $user->id)
            ->whereIn('status', ['pending', 'in_progress'])
            ->orderBy('end_date', 'asc')
            ->limit(5)
            ->get();
    }

    private function getTasksByProject($user)
    {
        $query = Project::with(['tasks' => function ($q) {
            $q->selectRaw('project_id, status, count(*) as count')
              ->groupBy('project_id', 'status');
        }]);
        
        if (!$user->hasRole('Administrador')) {
            $query->whereHas('users', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            });
        }
        
        return $query->limit(5)->get();
    }
}
