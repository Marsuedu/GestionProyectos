<?php

namespace Tests\Feature\Tasks;

use App\Models\Project;
use App\Models\Role;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VisibilityFeatureTest extends TestCase
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
    public function non_admin_sees_only_assigned_or_project_tasks(): void
    {
        $member = User::factory()->create(['is_enabled' => true]);
        $other = User::factory()->create(['is_enabled' => true]);
        $creator = User::factory()->create(['is_enabled' => true]);

        // Project A (member is part of it)
        $projectA = Project::factory()->create(['created_by' => $creator->id]);
        $projectA->users()->attach([$member->id]);

        // Project B (member is NOT part of it)
        $projectB = Project::factory()->create(['created_by' => $creator->id]);
        $projectB->users()->attach([$other->id]);

        // Tasks
        $taskVisible1 = Task::factory()->create([
            'project_id' => $projectA->id,
            'assigned_user_id' => $other->id, // same project membership
            'created_by' => $creator->id,
            'title' => 'Tarea visible por proyecto',
        ]);
        $taskVisible2 = Task::factory()->create([
            'project_id' => $projectA->id,
            'assigned_user_id' => $member->id, // assigned to member
            'created_by' => $creator->id,
            'title' => 'Tarea visible por asignación',
        ]);
        $taskHidden = Task::factory()->create([
            'project_id' => $projectB->id,
            'assigned_user_id' => $other->id,
            'created_by' => $creator->id,
            'title' => 'Tarea NO visible',
        ]);

        $this->actingAs($member);
        $response = $this->get(route('tasks.index'));
        $response->assertStatus(200);
        $response->assertSee('Tarea visible por proyecto');
        $response->assertSee('Tarea visible por asignación');
        $response->assertDontSee('Tarea NO visible');
    }

    /** @test */
    public function admin_sees_all_tasks(): void
    {
        $admin = $this->createAdmin();
        $creator = User::factory()->create(['is_enabled' => true]);
        $p1 = Project::factory()->create(['created_by' => $creator->id]);
        $p2 = Project::factory()->create(['created_by' => $creator->id]);
        $t1 = Task::factory()->create(['project_id' => $p1->id, 'assigned_user_id' => $admin->id, 'created_by' => $creator->id, 'title' => 'Tarea Admin 1']);
        $t2 = Task::factory()->create(['project_id' => $p2->id, 'assigned_user_id' => $creator->id, 'created_by' => $creator->id, 'title' => 'Tarea Admin 2']);

        $this->actingAs($admin);
        $response = $this->get(route('tasks.index'));
        $response->assertStatus(200);
        $response->assertSee('Tarea Admin 1');
        $response->assertSee('Tarea Admin 2');
    }
}
