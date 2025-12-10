<?php

namespace Tests\Feature\Tasks;

use App\Models\Project;
use App\Models\Role;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CreateTaskFeatureTest extends TestCase
{
    use RefreshDatabase;

    protected function createAdmin(): User
    {
        $adminRole = Role::create(['name' => 'Administrador', 'description' => 'Admin role']);
        $admin = User::factory()->create(['is_enabled' => true]);
        $admin->roles()->attach($adminRole->id);
        return $admin;
    }

    protected function createProjectWithMembers(): array
    {
        $creator = User::factory()->create(['is_enabled' => true]);
        $project = Project::factory()->create(['created_by' => $creator->id]);
        $members = User::factory(3)->create(['is_enabled' => true]);
        $project->users()->attach($members->pluck('id')->all());
        return [$project, $members, $creator];
    }

    /** @test */
    public function admin_can_create_task_for_any_project(): void
    {
        [$project, $members] = $this->createProjectWithMembers();
        $admin = $this->createAdmin();

        $this->actingAs($admin);
        $response = $this->post(route('tasks.store'), [
            'title' => 'Tarea 1',
            'description' => 'Descripción',
            'start_date' => '2025-01-05',
            'end_date' => '2025-01-20',
            'project_id' => $project->id,
            'assigned_user_id' => $members->first()->id,
        ]);

        $response->assertStatus(302);
        $this->assertDatabaseHas('tasks', [
            'title' => 'Tarea 1',
            'project_id' => $project->id,
            'assigned_user_id' => $members->first()->id,
        ]);
    }

    /** @test */
    public function validation_errors_on_invalid_task_payload(): void
    {
        [$project, $members] = $this->createProjectWithMembers();
        $admin = $this->createAdmin();
        $this->actingAs($admin);

        $response = $this->post(route('tasks.store'), [
            'title' => '',
            'description' => '',
            'start_date' => '2025-02-10',
            'end_date' => '2025-01-01', // invalid
            'project_id' => 999999, // not exists
            'assigned_user_id' => 999999, // not exists
        ]);

        $response->assertSessionHasErrors(['title', 'description', 'end_date', 'project_id', 'assigned_user_id']);
    }

    /** @test */
    public function non_member_non_admin_cannot_create_task_in_project(): void
    {
        [$project, $members] = $this->createProjectWithMembers();
        $outsider = User::factory()->create(['is_enabled' => true]);
        $this->actingAs($outsider);

        $response = $this->post(route('tasks.store'), [
            'title' => 'Tarea inválida',
            'description' => 'Desc',
            'start_date' => '2025-01-05',
            'end_date' => '2025-01-20',
            'project_id' => $project->id,
            'assigned_user_id' => $members->first()->id,
        ]);

        $this->assertTrue(in_array($response->getStatusCode(), [302, 403]));
        $this->assertDatabaseMissing('tasks', ['title' => 'Tarea inválida']);
    }
}
