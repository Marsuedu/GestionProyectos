<?php

namespace Tests\Unit;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function password_is_hashed_when_creating_user(): void
    {
        $user = User::factory()->create([
            'password' => 'secret123',
        ]);

        $this->assertTrue(Hash::check('secret123', $user->password));
        $this->assertFalse(Hash::check('plain', $user->password));
    }

    /** @test */
    public function user_can_be_disabled_or_enabled(): void
    {
        $enabled = User::factory()->create(['is_enabled' => true]);
        $disabled = User::factory()->create(['is_enabled' => false]);

        $this->assertTrue((bool) $enabled->is_enabled);
        $this->assertFalse((bool) $disabled->is_enabled);
    }

    /** @test */
    public function user_can_have_multiple_roles(): void
    {
        $admin = Role::create(['name' => 'Administrador', 'description' => 'Admin role']);
        $pm = Role::create(['name' => 'Responsable de proyecto', 'description' => 'Project manager role']);

        $user = User::factory()->create();
        $user->roles()->attach([$admin->id, $pm->id]);

        $this->assertCount(2, $user->roles);
        $this->assertTrue($user->roles->pluck('name')->contains('Administrador'));
        $this->assertTrue($user->roles->pluck('name')->contains('Responsable de proyecto'));
    }
}
