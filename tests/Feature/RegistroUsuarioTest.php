<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Foundation\Testing\WithFaker;

class RegistroUsuarioTest extends TestCase
{
    use DatabaseTransactions;
    use WithFaker;

    #[\PHPUnit\Framework\Attributes\Test]
    public function puede_registrar_usuario_con_roles()
    {
        // 🔹 Verifica que exista al menos un rol real
        $role = Role::first();
        $this->assertNotNull($role, 'Debe existir al menos un rol en la base de datos real');

        // 🔹 Datos reales de prueba
        $data = [
            'name' => 'Usuario Prueba',
            'email' => $this->faker->unique()->safeEmail(),
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'phone' => '987654321',
            'is_enabled' => true,
            'roles' => [$role->id],
        ];

        // 🔹 Enviar el POST al controlador de registro
        $response = $this->post('/register', $data);

        // 🔹 Verifica que redirige correctamente
        $response->assertRedirect('/dashboard');

        // 🔹 Comprueba que el usuario se guardó
        $this->assertDatabaseHas('users', [
            'email' => $data['email'],
            'name' => 'Usuario Prueba',
        ]);
    }
}
