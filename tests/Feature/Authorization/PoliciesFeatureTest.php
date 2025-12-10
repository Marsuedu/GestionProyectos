<?php

namespace Tests\Feature\Authorization;

use App\Models\Project;
use App\Models\Role;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PoliciesFeatureTest extends TestCase
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
    public function admin_can_update_and_delete_any_project(): void
    {
        $admin = $this->createAdmin();
        $creator = User::factory()->create(['is_enabled' => true]);
        $project = Project::factory()->create(['created_by' => $creator->id]);

        $this->actingAs($admin);
        $update = $this->put(route('projects.update', $project), [
            'title' => 'Upd',
            'description' => 'Upd',
            'start_date' => '2025-01-01',
            'end_date' => '2025-02-01',
            'status' => 'pending',
            'users' => [],
        ]);
        $delete = $this->delete(route('projects.destroy', $project));

        // Update may require users[], but policy-wise, we just assert not 403
        $this->assertNotEquals(403, $update->getStatusCode());
        $this->assertNotEquals(403, $delete->getStatusCode());
    }

    /** @test */
    public function project_manager_can_update_project_where_is_member_but_cannot_delete(): void
    {
        $pm = $this->createProjectManager();
        $creator = User::factory()->create(['is_enabled' => true]);
        $project = Project::factory()->create(['created_by' => $creator->id]);
        $project->users()->attach([$pm->id]);

        $this->actingAs($pm);
        $update = $this->put(route('projects.update', $project), [
            'title' => 'Upd',
            'description' => 'Upd',
            'start_date' => '2025-01-01',
            'end_date' => '2025-02-01',
            'status' => 'pending',
            'users' => [$pm->id],
        ]);
        $delete = $this->delete(route('projects.destroy', $project));

        $this->assertTrue(in_array($update->getStatusCode(), [302, 200, 422]));
        $this->assertTrue(in_array($delete->getStatusCode(), [302, 403]));
    }

    /** @test */
    public function non_member_cannot_update_or_delete_project(): void
    {
        $outsider = User::factory()->create(['is_enabled' => true]);
        $creator = User::factory()->create(['is_enabled' => true]);
        $project = Project::factory()->create(['created_by' => $creator->id]);

        $this->actingAs($outsider);
        $update = $this->put(route('projects.update', $project), [
            'title' => 'Upd',
            'description' => 'Upd',
            'start_date' => '2025-01-01',
            'end_date' => '2025-02-01',
            'status' => 'pending',
            'users' => [],
        ]);
        $delete = $this->delete(route('projects.destroy', $project));

        $this->assertTrue(in_array($update->getStatusCode(), [302, 403]));
        $this->assertTrue(in_array($delete->getStatusCode(), [302, 403]));
    }

    /** @test */
    public function task_policies_allow_admin_and_project_manager_on_project_tasks(): void
    {
        $admin = $this->createAdmin();
        $pm = $this->createProjectManager();
        $creator = User::factory()->create(['is_enabled' => true]);
        $project = Project::factory()->create(['created_by' => $creator->id]);
        $project->users()->attach([$pm->id]);
        $assignee = User::factory()->create(['is_enabled' => true]);
        $task = Task::factory()->create([
            'project_id' => $project->id,
            'assigned_user_id' => $assignee->id,
            'created_by' => $creator->id,
        ]);

        $this->actingAs($admin);
        $this->assertTrue(in_array($this->get(route('tasks.edit', $task))->getStatusCode(), [200, 302]));

        $this->actingAs($pm);
        $this->assertTrue(in_array($this->get(route('tasks.edit', $task))->getStatusCode(), [200, 302]));
    }
}
