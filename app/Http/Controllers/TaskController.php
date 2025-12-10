<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Project;
use App\Models\File;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        
        $query = Task::with(['project', 'assignedUser', 'creator']);

        // Non-admin users only see their assigned tasks or tasks from their projects
        if (!$user->hasRole('Administrador')) {
            $query->where(function ($q) use ($user) {
                $q->where('assigned_user_id', $user->id)
                  ->orWhere('created_by', $user->id)
                  ->orWhereHas('project.users', function ($subQ) use ($user) {
                      $subQ->where('user_id', $user->id);
                  });
            });
        }

        $perPage = min(max((int) $request->integer('per_page', 10), 1), 100);
        $tasks = $query->paginate($perPage)->withQueryString();
        
        return Inertia::render('Tasks/Index', [
            'tasks' => $tasks,
        ]);
    }

    public function create()
    {
        $user = auth()->user();
        
        $projectsQuery = Project::query();
        
        // Non-admin users can only create tasks for their assigned projects
        if (!$user->hasRole('Administrador')) {
            $projectsQuery->whereHas('users', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            });
        }
        
        $projects = $projectsQuery->get();
        $users = User::where('is_enabled', true)->get();
        
        return Inertia::render('Tasks/Create', [
            'projects' => $projects,
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'project_id' => 'required|exists:projects,id',
            'assigned_user_id' => 'required|exists:users,id',
            'files' => 'sometimes|array',
            'files.*' => 'file|mimes:pdf,doc,docx,jpg,jpeg|max:5120',
        ]);

        $project = Project::findOrFail($validated['project_id']);
        // Ensure task dates are within project date range
        $taskStart = strtotime($validated['start_date']);
        $taskEnd = strtotime($validated['end_date']);
        $projectStart = strtotime((string) $project->start_date);
        $projectEnd = strtotime((string) $project->end_date);

        if ($taskStart < $projectStart || $taskEnd > $projectEnd) {
            return back()->withErrors([
                'start_date' => 'La fecha de la tarea debe estar dentro del rango del proyecto (' . $project->start_date . ' a ' . $project->end_date . ').',
                'end_date' => 'La fecha de la tarea debe estar dentro del rango del proyecto (' . $project->start_date . ' a ' . $project->end_date . ').',
            ])->withInput();
        }
        
        // Check if user can create tasks for this project
        if (!auth()->user()->hasRole('Administrador') && 
            !$project->users->contains(auth()->id())) {
            abort(403, 'No tienes permisos para crear tareas en este proyecto.');
        }

        $task = Task::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'project_id' => $validated['project_id'],
            'assigned_user_id' => $validated['assigned_user_id'],
            'created_by' => auth()->id(),
        ]);

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $uploaded) {
                $fileName = Str::uuid().'.'.$uploaded->getClientOriginalExtension();
                $path = $uploaded->storeAs('uploads', $fileName, 'public');

                File::create([
                    'name' => $fileName,
                    'original_name' => $uploaded->getClientOriginalName(),
                    'path' => $path,
                    'size' => $uploaded->getSize(),
                    'mime_type' => $uploaded->getMimeType(),
                    'fileable_type' => Task::class,
                    'fileable_id' => $task->id,
                    'uploaded_by' => auth()->id(),
                ]);
            }
        }

        return redirect()->route('tasks.index')
            ->with('success', 'Tarea creada exitosamente.');
    }

    public function show(Task $task)
    {
        $this->authorize('view', $task);
        
        $task->load([
            'project',
            'assignedUser',
            'creator',
            'files.uploader'
        ]);
        
        return Inertia::render('Tasks/Show', [
            'task' => $task,
        ]);
    }

    public function edit(Task $task)
    {
        $this->authorize('update', $task);
        
        $user = auth()->user();
        
        $projectsQuery = Project::query();
        
        // Non-admin users can only see their assigned projects
        if (!$user->hasRole('Administrador')) {
            $projectsQuery->whereHas('users', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            });
        }
        
        $projects = $projectsQuery->get();
        $users = User::where('is_enabled', true)->get();
        
        return Inertia::render('Tasks/Edit', [
            'task' => $task,
            'projects' => $projects,
            'users' => $users,
        ]);
    }

    public function update(Request $request, Task $task)
    {
        $this->authorize('update', $task);
        
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'status' => 'required|in:pending,in_progress,completed',
            'project_id' => 'required|exists:projects,id',
            'assigned_user_id' => 'required|exists:users,id',
        ]);

        // Ensure task dates are within project date range on update
        $project = Project::findOrFail($validated['project_id']);
        $taskStart = strtotime($validated['start_date']);
        $taskEnd = strtotime($validated['end_date']);
        $projectStart = strtotime((string) $project->start_date);
        $projectEnd = strtotime((string) $project->end_date);

        if ($taskStart < $projectStart || $taskEnd > $projectEnd) {
            return back()->withErrors([
                'start_date' => 'La fecha de la tarea debe estar dentro del rango del proyecto (' . $project->start_date . ' a ' . $project->end_date . ').',
                'end_date' => 'La fecha de la tarea debe estar dentro del rango del proyecto (' . $project->start_date . ' a ' . $project->end_date . ').',
            ])->withInput();
        }

        $task->update($validated);

        return redirect()->route('tasks.index')
            ->with('success', 'Tarea actualizada exitosamente.');
    }

    public function destroy(Task $task)
    {
        $this->authorize('delete', $task);
        
        $task->delete();

        return redirect()->route('tasks.index')
            ->with('success', 'Tarea eliminada exitosamente.');
    }

    public function updateStatus(Request $request, Task $task)
    {
        $this->authorize('updateStatus', $task);
        
        $validated = $request->validate([
            'status' => 'required|in:pending,in_progress,completed',
        ]);

        $task->update(['status' => $validated['status']]);

        return back()->with('success', 'Estado de la tarea actualizado.');
    }
}
