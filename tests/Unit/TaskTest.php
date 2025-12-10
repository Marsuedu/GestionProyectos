<?php

namespace Tests\Unit;

use App\Models\File;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class TaskTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function task_dates_are_cast_and_status_is_valid(): void
    {
        $project = Project::factory()->create(['created_by' => User::factory()->create()->id]);
        $assigned = User::factory()->create();
        $creator = User::factory()->create();

        $task = Task::factory()->create([
            'project_id' => $project->id,
            'assigned_user_id' => $assigned->id,
            'created_by' => $creator->id,
            'start_date' => '2025-03-01',
            'end_date' => '2025-03-20',
            'status' => Task::STATUS_IN_PROGRESS,
        ]);

        $this->assertInstanceOf(Carbon::class, $task->start_date);
        $this->assertInstanceOf(Carbon::class, $task->end_date);
        $this->assertEquals('2025-03-01', $task->start_date->format('Y-m-d'));
        $this->assertEquals('2025-03-20', $task->end_date->format('Y-m-d'));
        $this->assertContains($task->status, [
            Task::STATUS_PENDING,
            Task::STATUS_IN_PROGRESS,
            Task::STATUS_COMPLETED,
        ]);
    }

    /** @test */
    public function task_relationships_work_project_assigned_user_creator_files(): void
    {
        $projectCreator = User::factory()->create();
        $project = Project::factory()->create(['created_by' => $projectCreator->id]);
        $assigned = User::factory()->create();
        $creator = User::factory()->create();

        $task = Task::factory()->create([
            'project_id' => $project->id,
            'assigned_user_id' => $assigned->id,
            'created_by' => $creator->id,
        ]);

        // project()
        $this->assertTrue($task->project->is($project));
        // assignedUser()
        $this->assertTrue($task->assignedUser->is($assigned));
        // creator()
        $this->assertTrue($task->creator->is($creator));

        // files() morphMany
        $uploader = User::factory()->create();
        $file = File::create([
            'name' => 'tarea_demo.pdf',
            'original_name' => 'tarea_demo.pdf',
            'path' => 'uploads/tarea_demo.pdf',
            'size' => 5678,
            'mime_type' => 'application/pdf',
            'fileable_type' => Task::class,
            'fileable_id' => $task->id,
            'uploaded_by' => $uploader->id,
        ]);

        $task->refresh();
        $this->assertCount(1, $task->files);
        $this->assertTrue($task->files->first()->is($file));
        $this->assertTrue($task->files->first()->uploader->is($uploader));
    }
}
