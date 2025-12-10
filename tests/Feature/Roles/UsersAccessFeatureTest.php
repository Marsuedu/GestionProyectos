<?php

namespace Tests\Feature\Roles;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UsersAccessFeatureTest extends TestCase
{
    use RefreshDatabase;

    protected function createAdmin(): User
    {
        $adminRole = Role::create(['name' => 'Administrador', 'description' => 'Admin role']);
        $admin = User::factory()->create(['is_enabled' => true]);
        $admin->roles()->attach($adminRole->id);
        return $admin;
    }

    /** @test */
    public function admin_can_access_users_resource(): void
    {
        $admin = $this->createAdmin();
        $this->actingAs($admin);

        $response = $this->get(route('users.index'));
        $response->assertStatus(200);
    }

    /** @test */
    public function non_admin_cannot_access_users_resource(): void
    {
        $user = User::factory()->create(['is_enabled' => true]);
        $this->actingAs($user);

        $response = $this->get(route('users.index'));
        $this->assertTrue(in_array($response->getStatusCode(), [302, 403]));
    }
}
