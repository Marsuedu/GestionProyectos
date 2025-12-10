<?php

namespace Tests\Feature\Performance;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ResponseTimeFeatureTest extends TestCase
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
    public function dashboard_responds_under_two_seconds(): void
    {
        $admin = $this->createAdmin();
        $this->actingAs($admin);

        $start = microtime(true);
        $response = $this->get(route('dashboard'));
        $durationMs = (microtime(true) - $start) * 1000;

        $response->assertStatus(200);
        $this->assertLessThanOrEqual(2000, $durationMs, 'Dashboard exceeded 2s');
    }

    /** @test */
    public function tasks_index_responds_under_two_seconds(): void
    {
        $admin = $this->createAdmin();
        $this->actingAs($admin);

        $start = microtime(true);
        $response = $this->get(route('tasks.index'));
        $durationMs = (microtime(true) - $start) * 1000;

        $response->assertStatus(200);
        $this->assertLessThanOrEqual(2000, $durationMs, 'Tasks index exceeded 2s');
    }
}
