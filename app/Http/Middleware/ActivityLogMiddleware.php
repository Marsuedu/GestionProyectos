<?php

namespace App\Http\Middleware;

use App\Models\ActivityLog;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ActivityLogMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Log activity for authenticated users on POST, PUT, PATCH, DELETE requests
        if (auth()->check() && in_array($request->method(), ['POST', 'PUT', 'PATCH', 'DELETE'])) {
            $this->logActivity($request);
        }

        return $response;
    }

    private function logActivity(Request $request): void
    {
        $route = $request->route();
        if (!$route) return;

        $action = $this->getActionFromRoute($request);
        if (!$action) return;

        ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => $action,
            'model_type' => $this->getModelFromRoute($route),
            'model_id' => $this->getModelIdFromRoute($route),
            'description' => $this->getDescription($request, $action),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);
    }

    private function getActionFromRoute(Request $request): ?string
    {
        $method = $request->method();
        $routeName = $request->route()->getName();

        if (str_contains($routeName, '.store')) return 'create';
        if (str_contains($routeName, '.update')) return 'update';
        if (str_contains($routeName, '.destroy')) return 'delete';

        return match($method) {
            'POST' => 'create',
            'PUT', 'PATCH' => 'update',
            'DELETE' => 'delete',
            default => null,
        };
    }

    private function getModelFromRoute($route): string
    {
        $routeName = $route->getName();
        
        if (str_contains($routeName, 'projects')) return 'App\Models\Project';
        if (str_contains($routeName, 'tasks')) return 'App\Models\Task';
        if (str_contains($routeName, 'users')) return 'App\Models\User';
        
        return 'Unknown';
    }

    private function getModelIdFromRoute($route): int
    {
        $parameters = $route->parameters();
        
        foreach (['project', 'task', 'user', 'id'] as $param) {
            if (isset($parameters[$param])) {
                return is_object($parameters[$param]) ? $parameters[$param]->id : $parameters[$param];
            }
        }
        
        return 0;
    }

    private function getDescription(Request $request, string $action): string
    {
        $routeName = $request->route()->getName();
        $user = auth()->user()->name;

        if (str_contains($routeName, 'projects')) {
            return match($action) {
                'create' => "{$user} creó un nuevo proyecto",
                'update' => "{$user} actualizó un proyecto",
                'delete' => "{$user} eliminó un proyecto",
                default => "{$user} realizó una acción en un proyecto",
            };
        }

        if (str_contains($routeName, 'tasks')) {
            return match($action) {
                'create' => "{$user} creó una nueva tarea",
                'update' => "{$user} actualizó una tarea",
                'delete' => "{$user} eliminó una tarea",
                default => "{$user} realizó una acción en una tarea",
            };
        }

        return "{$user} realizó una acción: {$action}";
    }
}
