<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
                
                // ✅ CORRECCIÓN AQUÍ:
                // Quitamos "->roles()->pluck(...)" y dejamos solo "->roles"
                // Como en el modelo User pusimos 'roles' => 'array', esto ya devuelve el array limpio.
                'roles' => $request->user() ? $request->user()->roles : [],
            ],
        ];
    }
}