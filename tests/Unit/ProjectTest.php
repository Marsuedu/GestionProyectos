<?php

namespace Tests\Unit;

use App\Models\File;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class ProjectTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function project_dates_are_cast_and_status_is_valid(): void
    {
        $creator = User::factory()->create();
        $project = Project::factory()->create([
            'created_by' => $creator->id,
            'start_date' => '2025-01-10',
            'end_date' => '2025-02-15',
            'status' => Project::STATUS_IN_PROGRESS,
        ]);

        $this->assertInstanceOf(Carbon::class, $project->start_date);
        $this->assertInstanceOf(Carbon::class, $project->end_date);
        $this->assertEquals('2025-01-10', $project->start_date->format('Y-m-d'));
        $this->assertEquals('2025-02-15', $project->end_date->format('Y-m-d'));
        $this->assertContains($project->status, [
            Project::STATUS_PENDING,
            Project::STATUS_IN_PROGRESS,
            Project::STATUS_COMPLETED,
            Project::STATUS_CANCELLED,
        ]);
    }

    /** @test */
    public function project_relationships_work_creator_users_tasks_files(): void
    {
        $creator = User::factory()->create();
        $users = User::factory(3)->create();

        $project = Project::factory()->create([
            'created_by' => $creator->id,
        ]);

        // creator()
        $this->assertTrue($project->creator->is($creator));

        // users() many-to-many
        $project->users()->attach($users->pluck('id')->all());
        $this->assertCount(3, $project->users);

        // tasks() hasMany
        $taskA = Task::factory()->create([
            'project_id' => $project->id,
            'assigned_user_id' => $users->first()->id,
            'created_by' => $creator->id,
        ]);
        $taskB = Task::factory()->create([
            'project_id' => $project->id,
            'assigned_user_id' => $users->get(1)->id,
            'created_by' => $creator->id,
        ]);
        $project->refresh();
        $this->assertCount(2, $project->tasks);
        $this->assertTrue($project->tasks->contains($taskA));
        $this->assertTrue($project->tasks->contains($taskB));

        // files() morphMany
        $uploader = User::factory()->create();
        $file = File::create([
            'name' => 'demo.pdf',
            'original_name' => 'demo.pdf',
            'path' => 'uploads/demo.pdf',
            'size' => 1234,
            'mime_type' => 'application/pdf',
            'fileable_type' => Project::class,
            'fileable_id' => $project->id,
            'uploaded_by' => $uploader->id,
        ]);

        $project->refresh();
        $this->assertCount(1, $project->files);
        $this->assertTrue($project->files->first()->is($file));
        $this->assertTrue($project->files->first()->uploader->is($uploader));
    }
}
