<?php

namespace Tests\Feature\Tasks;

use App\Models\File;
use App\Models\Project;
use App\Models\Role;
use App\Models\Task;
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

    protected function createTask(): Task
    {
        $creator = User::factory()->create(['is_enabled' => true]);
        $project = Project::factory()->create(['created_by' => $creator->id]);
        $assignee = User::factory()->create(['is_enabled' => true]);
        $task = Task::factory()->create([
            'project_id' => $project->id,
            'assigned_user_id' => $assignee->id,
            'created_by' => $creator->id,
        ]);
        return $task;
    }

    /** @test */
    public function can_upload_valid_file_to_task(): void
    {
        Storage::fake('public');
        $admin = $this->createAdmin();
        $task = $this->createTask();
        $this->actingAs($admin);

        $file = UploadedFile::fake()->create('evidencia.jpg', 200, 'image/jpeg');
        $response = $this->post(route('files.store'), [
            'file' => $file,
            'fileable_type' => Task::class,
            'fileable_id' => $task->id,
        ]);

        $response->assertStatus(302);
        $this->assertDatabaseCount('files', 1);
        $stored = File::first();
        Storage::disk('public')->assertExists($stored->path);
        $this->assertEquals(Task::class, $stored->fileable_type);
        $this->assertEquals($task->id, $stored->fileable_id);
        $this->assertEquals($admin->id, $stored->uploaded_by);
    }

    /** @test */
    public function reject_invalid_mime_for_task_upload(): void
    {
        Storage::fake('public');
        $admin = $this->createAdmin();
        $task = $this->createTask();
        $this->actingAs($admin);

        $file = UploadedFile::fake()->create('script.sh', 10, 'text/x-shellscript');
        $response = $this->post(route('files.store'), [
            'file' => $file,
            'fileable_type' => Task::class,
            'fileable_id' => $task->id,
        ]);

        $response->assertSessionHasErrors(['file']);
        $this->assertDatabaseCount('files', 0);
    }
}
