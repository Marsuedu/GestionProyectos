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
    // 1. Validar que roles sea un array (opcional pero recomendado)
    $request->validate([
        'phone' => 'nullable|string|max:20',
        'roles' => 'nullable|array', // <--- Importante
    ]);

    // 2. Actualizar el usuario
    // Como ya agregaste 'roles' al $fillable, esto ahora SÍ funcionará
    $request->user()->update([
        'phone' => $request->phone,
        'is_active' => $request->boolean('is_active'), // boolean() asegura true/false
        'roles' => $request->roles,
    ]);

    return redirect()->route('dashboard');
}
}
