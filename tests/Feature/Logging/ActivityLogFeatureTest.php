<?php

namespace Tests\Feature\Logging;

use App\Models\ActivityLog;
use App\Models\Project;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ActivityLogFeatureTest extends TestCase
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
    public function creating_updating_and_deleting_project_writes_activity_logs(): void
    {
        $admin = $this->createAdmin();
        $member = User::factory()->create(['is_enabled' => true]);
        $this->actingAs($admin);

        // Create
        $respCreate = $this->post(route('projects.store'), [
            'title' => 'Proyecto Log',
            'description' => 'Desc',
            'start_date' => '2025-01-01',
            'end_date' => '2025-02-01',
            'users' => [$member->id],
        ]);
        $respCreate->assertStatus(302);
        $this->assertGreaterThanOrEqual(1, ActivityLog::count());
        $createLog = ActivityLog::latest('id')->first();
        $this->assertEquals('create', $createLog->action);

        $project = Project::where('title', 'Proyecto Log')->first();

        // Update
        $respUpdate = $this->put(route('projects.update', $project), [
            'title' => 'Proyecto Log 2',
            'description' => 'Desc2',
            'start_date' => '2025-01-01',
            'end_date' => '2025-02-10',
            'status' => 'pending',
            'users' => [$member->id],
        ]);
        $respUpdate->assertStatus(302);
        $updateLog = ActivityLog::latest('id')->first();
        $this->assertEquals('update', $updateLog->action);

        // Delete
        $respDelete = $this->delete(route('projects.destroy', $project));
        $this->assertTrue(in_array($respDelete->getStatusCode(), [302, 200]));
        $deleteLog = ActivityLog::latest('id')->first();
        $this->assertEquals('delete', $deleteLog->action);
    }
}
