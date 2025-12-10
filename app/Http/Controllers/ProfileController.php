<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }
    /**
     * Show the complete profile form.
     */
    public function completeShow(): Response
    {
        return Inertia::render('Auth/CompleteProfile');
    }

    /**
     * Store the completed profile information.
     */
    public function completeStore(Request $request)
    {
        // 1. Validamos TODOS los campos por seguridad
        $request->validate([
            'phone' => 'nullable|string|max:20',
            'is_active' => 'boolean',      // Validamos que sea verdadero/falso
            'roles' => 'nullable|array',   // Validamos que sea un array
        ]);

        // 2. Actualizar el usuario
        // Al usar update(), Laravel revisa el $fillable del Modelo User.
        // Como ya arreglamos el modelo, esto guardará los datos en las columnas JSON y String.
        $request->user()->update([
            'phone' => $request->phone,
            'is_active' => $request->boolean('is_active'), // Convierte "on", 1, "true" a booleano real
            
            // TRUCO DE SEGURIDAD:
            // Si el usuario desmarca todo, 'roles' podría llegar como null.
            // Usamos '?? []' para asegurar que se guarde un array vacío en la BD y no de error.
            'roles' => $request->roles ?? [], 
        ]);

        // 3. Redirigir al Dashboard
        return redirect()->route('dashboard');
    }
}
