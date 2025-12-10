<?php

namespace Tests\Feature\Tasks;

use App\Models\Project;
use App\Models\Role;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UpdateStatusFeatureTest extends TestCase
{
    use RefreshDatabase;

    protected function createAdmin(): User
    {
        $adminRole = Role::create(['name' => 'Administrador', 'description' => 'Admin role']);
        $admin = User::factory()->create(['is_enabled' => true]);
        $admin->roles()->attach($adminRole->id);
        return $admin;
    }

    protected function createTaskAssignedTo(User $assignee): Task
    {
        $creator = User::factory()->create(['is_enabled' => true]);
        $project = Project::factory()->create(['created_by' => $creator->id]);
        return Task::factory()->create([
            'project_id' => $project->id,
            'assigned_user_id' => $assignee->id,
            'created_by' => $creator->id,
            'status' => Task::STATUS_PENDING,
        ]);
    }

    /** @test */
    public function admin_can_update_any_task_status(): void
    {
        $admin = $this->createAdmin();
        $assignee = User::factory()->create(['is_enabled' => true]);
        $task = $this->createTaskAssignedTo($assignee);

        $this->actingAs($admin);
        $response = $this->patch(route('tasks.update-status', $task), [
            'status' => Task::STATUS_COMPLETED,
        ]);

        $response->assertStatus(302);
        $this->assertEquals(Task::STATUS_COMPLETED, $task->fresh()->status);
    }

    /** @test */
    public function assigned_user_can_update_own_task_status(): void
    {
        $assignee = User::factory()->create(['is_enabled' => true]);
        $task = $this->createTaskAssignedTo($assignee);

        $this->actingAs($assignee);
        $response = $this->patch(route('tasks.update-status', $task), [
            'status' => Task::STATUS_IN_PROGRESS,
        ]);

        $response->assertStatus(302);
        $this->assertEquals(Task::STATUS_IN_PROGRESS, $task->fresh()->status);
    }

    /** @test */
    public function other_users_cannot_update_task_status(): void
    {
        $assignee = User::factory()->create(['is_enabled' => true]);
        $task = $this->createTaskAssignedTo($assignee);
        $stranger = User::factory()->create(['is_enabled' => true]);

        $this->actingAs($stranger);
        $response = $this->patch(route('tasks.update-status', $task), [
            'status' => Task::STATUS_COMPLETED,
        ]);

        $this->assertTrue(in_array($response->getStatusCode(), [302, 403]));
        $this->assertEquals(Task::STATUS_PENDING, $task->fresh()->status);
    }
}
