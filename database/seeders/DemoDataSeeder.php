<?php

namespace Database\Seeders;

use App\Models\File;
use App\Models\Project;
use App\Models\Role;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        // Ensure roles exist
        $this->call(RoleSeeder::class);

        // Ensure admin exists
        $this->call(AdminUserSeeder::class);

        // Create additional users
        $pmRole = Role::where('name', 'Responsable de proyecto')->first();
        $tmRole = Role::where('name', 'Responsable de tarea')->first();

        $projectManagers = User::factory(3)->create(['is_enabled' => true]);
        foreach ($projectManagers as $u) {
            $u->roles()->syncWithoutDetaching([$pmRole->id]);
        }

        $taskManagers = User::factory(5)->create(['is_enabled' => true]);
        foreach ($taskManagers as $u) {
            $u->roles()->syncWithoutDetaching([$tmRole->id]);
        }

        $contributors = User::factory(8)->create(['is_enabled' => true]);

        $allUsers = User::all();

        // Create projects
        $projects = Project::factory(6)->make();
        foreach ($projects as $project) {
            // Pick a creator (pm or admin) randomly
            $creator = $projectManagers->random();
            $created = Project::create(array_merge($project->toArray(), [
                'created_by' => $creator->id,
            ]));

            // Attach between 3 and 6 users to project (including creator)
            $memberIds = $allUsers->random(mt_rand(3, 6))->pluck('id')->toArray();
            $memberIds[] = $creator->id;
            $created->users()->sync(array_unique($memberIds));

            // Create tasks for project
            $numTasks = mt_rand(5, 12);
            for ($i = 0; $i < $numTasks; $i++) {
                $assignedUserId = $created->users()->inRandomOrder()->value('user_id');
                $task = Task::factory()->create([
                    'project_id' => $created->id,
                    'assigned_user_id' => $assignedUserId,
                    'created_by' => $creator->id,
                ]);

                // Attach demo files to some tasks
                if (mt_rand(0, 1) === 1) {
                    $this->attachDemoFiles($task);
                }
            }

            // Attach demo files to some projects
            if (mt_rand(0, 1) === 1) {
                $this->attachDemoFiles($created);
            }
        }
    }

    /**
     * @param \App\Models\Project|\App\Models\Task $fileable
     */
    protected function attachDemoFiles($fileable): void
    {
        // Ensure public disk is available (storage:link recommended)
        $count = mt_rand(1, 3);
        for ($i = 0; $i < $count; $i++) {
            $faker = fake();
            // Choose a random file type
            $sample = $faker->randomElement([
                ['ext' => 'pdf', 'mime' => 'application/pdf', 'name' => 'reporte'],
                ['ext' => 'docx', 'mime' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'name' => 'documento'],
                ['ext' => 'jpg', 'mime' => 'image/jpeg', 'name' => 'captura'],
            ]);

            $uuidName = (string) Str::uuid() . '.' . $sample['ext'];
            $path = 'uploads/' . $uuidName;

            // Write a small placeholder file
            if ($sample['ext'] === 'jpg') {
                $content = base64_decode('/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAQEA8QDw8QDw8PDw8QDw8PDw8PDw8PFREWFhURFRUYHSggGBolGxUVITEhJSkrLi4uFx8zODMsNygtLisBCgoKDg0OGxAQGzAmICUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAMgAyAMBIgACEQEDEQH/xAAXAAEBAQEAAAAAAAAAAAAAAAAAAQID/8QAHxABAQACAgIDAQAAAAAAAAAAAgEDBBEhMRJBUXGR/8QAFQEBAQAAAAAAAAAAAAAAAAAAAgP/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwC0gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/Z');
            } else {
                $content = 'Demo file for testing uploads.';
            }

            Storage::disk('public')->put($path, $content);

            File::create([
                'name' => $uuidName,
                'original_name' => $sample['name'] . '_' . now()->format('Ymd_His') . '.' . $sample['ext'],
                'path' => $path,
                'size' => Storage::disk('public')->size($path),
                'mime_type' => $sample['mime'],
                'fileable_type' => get_class($fileable),
                'fileable_id' => $fileable->id,
                'uploaded_by' => User::inRandomOrder()->value('id'),
            ]);
        }
    }
}
