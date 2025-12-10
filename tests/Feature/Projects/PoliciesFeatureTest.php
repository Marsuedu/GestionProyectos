<?php

namespace Tests\Feature\Projects;

use App\Models\Project;
use App\Models\Role;
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

    /** @test */
    public function only_admin_can_delete_project(): void
    {
        $admin = $this->createAdmin();
        $creator = User::factory()->create(['is_enabled' => true]);
        $project = Project::factory()->create(['created_by' => $creator->id]);

        // Non-admin cannot delete
        $this->actingAs($creator);
        $resp = $this->delete(route('projects.destroy', $project));
        $this->assertTrue(in_array($resp->getStatusCode(), [302, 403]));

        // Admin can delete
        $this->actingAs($admin);
        $resp2 = $this->delete(route('projects.destroy', $project));
        $this->assertTrue(in_array($resp2->getStatusCode(), [302, 200]));
    }
}
