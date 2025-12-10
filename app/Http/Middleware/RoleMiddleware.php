<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, $role)
    {
        $user = $request->user();

        // 1. Verificar si hay usuario logueado
        if (!$user) {
            abort(403, 'No tienes permiso para acceder a esta sección.');
        }

        // 2. Obtener los roles (Asegurando que sea un array, aunque venga null)
        // Gracias al cast 'roles' => 'array' en el modelo User, esto debería ser un array o null.
        $userRoles = $user->roles ?? [];

        // 3. Verificar si el rol requerido está en la lista (Array simple)
        // Usamos in_array porque ahora es una lista de textos: ['Administrador', 'Responsable...']
        if (!in_array($role, $userRoles)) {
            abort(403, 'No tienes permiso para acceder a esta sección.');
        }

        return $next($request);
    }
}