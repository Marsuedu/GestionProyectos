<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class LoginFeatureTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function user_can_login_with_valid_credentials(): void
    {
        $user = User::factory()->create([
            'email' => 'user@example.com',
            'password' => Hash::make('password123'),
            'is_enabled' => true,
        ]);

        $response = $this->post('/login', [
            'email' => 'user@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(302);
        $this->assertAuthenticatedAs($user);
    }

    /** @test */
    public function disabled_user_cannot_access_protected_routes(): void
    {
        $user = User::factory()->create([
            'email' => 'user2@example.com',
            'password' => Hash::make('password123'),
            'is_enabled' => false,
        ]);

        // Intenta loguear (según implementación podría iniciar sesión, pero policies deben bloquear acceso)
        $this->post('/login', [
            'email' => 'user2@example.com',
            'password' => 'password123',
        ]);

        // Visita una ruta protegida
        $response = $this->get('/projects');
        // Debe ser redirigido o 403 según middleware/policies; garantizamos que NO es 200
        $this->assertTrue(in_array($response->getStatusCode(), [302, 403]));
    }
}
