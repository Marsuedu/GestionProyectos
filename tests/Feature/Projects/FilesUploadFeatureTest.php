<?php

namespace Tests\Feature\Projects;

use App\Models\File;
use App\Models\Project;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class FilesUploadFeatureTest extends TestCase
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
    public function can_upload_valid_file_to_project(): void
    {
        Storage::fake('public');
        $admin = $this->createAdmin();
        $project = Project::factory()->create(['created_by' => $admin->id]);
        $this->actingAs($admin);

        $file = UploadedFile::fake()->create('archivo.pdf', 200, 'application/pdf');
        $response = $this->post(route('files.store'), [
            'file' => $file,
            'fileable_type' => Project::class,
            'fileable_id' => $project->id,
        ]);

        $response->assertStatus(302);
        $this->assertDatabaseCount('files', 1);
        $stored = File::first();
        Storage::disk('public')->assertExists($stored->path);
        $this->assertEquals(Project::class, $stored->fileable_type);
        $this->assertEquals($project->id, $stored->fileable_id);
        $this->assertEquals($admin->id, $stored->uploaded_by);
    }

    /** @test */
    public function reject_invalid_mime_for_project_upload(): void
    {
        Storage::fake('public');
        $admin = $this->createAdmin();
        $project = Project::factory()->create(['created_by' => $admin->id]);
        $this->actingAs($admin);

        $file = UploadedFile::fake()->create('malware.exe', 10, 'application/octet-stream');
        $response = $this->post(route('files.store'), [
            'file' => $file,
            'fileable_type' => Project::class,
            'fileable_id' => $project->id,
        ]);

        $response->assertSessionHasErrors(['file']);
        $this->assertDatabaseCount('files', 0);
    }
}
