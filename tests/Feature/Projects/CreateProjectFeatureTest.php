<?php

namespace Tests\Feature\Projects;

use App\Models\Project;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CreateProjectFeatureTest extends TestCase
{
    use RefreshDatabase;

    protected function createAdmin(): User
    {
        $adminRole = Role::create(['name' => 'Administrador', 'description' => 'Admin role']);
        $admin = User::factory()->create(['is_enabled' => true]);
        $admin->roles()->attach($adminRole->id);
        return $admin;
    }

    protected function createProjectManager(): User
    {
        $pmRole = Role::create(['name' => 'Responsable de proyecto', 'description' => 'PM role']);
        $pm = User::factory()->create(['is_enabled' => true]);
        $pm->roles()->attach($pmRole->id);
        return $pm;
    }

    /** @test */
    public function admin_can_create_project_with_assigned_users(): void
    {
        $admin = $this->createAdmin();
        $users = User::factory(3)->create(['is_enabled' => true]);

        $this->actingAs($admin);
        $response = $this->post(route('projects.store'), [
            'title' => 'Proyecto Alpha',
            'description' => 'Descripción del proyecto',
            'start_date' => '2025-01-01',
            'end_date' => '2025-02-01',
            'users' => $users->pluck('id')->all(),
        ]);

        $response->assertStatus(302);
        $this->assertDatabaseHas('projects', ['title' => 'Proyecto Alpha']);
        $project = Project::where('title', 'Proyecto Alpha')->first();
        $this->assertEquals($admin->id, $project->created_by);
        $this->assertCount(3, $project->users);
    }

    /** @test */
    public function non_authorized_user_cannot_create_project(): void
    {
        $user = User::factory()->create(['is_enabled' => true]);
        $this->actingAs($user);

        $response = $this->post(route('projects.store'), [
            'title' => 'Proyecto Beta',
            'description' => 'Desc',
            'start_date' => '2025-01-01',
            'end_date' => '2025-02-01',
            'users' => [$user->id],
        ]);

        $this->assertTrue(in_array($response->getStatusCode(), [302, 403]));
        $this->assertDatabaseMissing('projects', ['title' => 'Proyecto Beta']);
    }

    /** @test */
    public function validation_errors_on_invalid_project_payload(): void
    {
        $admin = $this->createAdmin();
        $this->actingAs($admin);

        $response = $this->post(route('projects.store'), [
            'title' => '',
            'description' => '',
            'start_date' => '2025-02-01',
            'end_date' => '2025-01-01', // invalid: end before start
            'users' => [],
        ]);

        $response->assertSessionHasErrors(['title', 'description', 'end_date', 'users']);
    }
}
