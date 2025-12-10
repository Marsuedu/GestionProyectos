<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\File;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        
        $query = Project::with(['creator', 'users', 'tasks'])
            ->withCount('tasks');

        // Non-admin users only see their assigned projects
        if (!$user->hasRole('Administrador')) {
            $query->whereHas('users', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            });
        }

        $perPage = min(max((int) $request->integer('per_page', 10), 1), 100);
        $projects = $query->paginate($perPage)->withQueryString();
        
        return Inertia::render('Projects/Index', [
            'projects' => $projects,
        ]);
    }

    public function create()
    {
        $this->authorize('create', Project::class);
        
        $users = User::where('is_enabled', true)->get();
        
        return Inertia::render('Projects/Create', [
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Project::class);
        
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'users' => 'required|array|min:1',
            'users.*' => 'exists:users,id',
            'files' => 'sometimes|array',
            'files.*' => 'file|mimes:pdf,doc,docx,jpg,jpeg|max:5120',
            'file' => 'sometimes|file|mimes:pdf,doc,docx,jpg,jpeg|max:5120',
        ]);

        $project = Project::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'created_by' => auth()->id(),
        ]);

        $project->users()->attach($validated['users']);

        $uploads = [];
        if ($request->hasFile('files')) {
            $uploads = $request->file('files');
        } elseif ($request->hasFile('file')) {
            $uploads = [$request->file('file')];
        }

        if (!empty($uploads)) {
            foreach ($uploads as $uploaded) {
                $fileName = Str::uuid().'.'.$uploaded->getClientOriginalExtension();
                $path = $uploaded->storeAs('uploads', $fileName, 'public');

                File::create([
                    'name' => $fileName,
                    'original_name' => $uploaded->getClientOriginalName(),
                    'path' => $path,
                    'size' => $uploaded->getSize(),
                    'mime_type' => $uploaded->getMimeType(),
                    'fileable_type' => Project::class,
                    'fileable_id' => $project->id,
                    'uploaded_by' => auth()->id(),
                ]);
            }
        }

        return redirect()->route('projects.index')
            ->with('success', 'Proyecto creado exitosamente.');
    }

    public function show(Project $project)
    {
        $this->authorize('view', $project);
        
        $project->load([
            'creator',
            'users',
            'tasks.assignedUser',
            'files.uploader'
        ]);
        
        return Inertia::render('Projects/Show', [
            'project' => $project,
        ]);
    }

    public function edit(Project $project)
    {
        $this->authorize('update', $project);
        
        $project->load('users');
        $users = User::where('is_enabled', true)->get();
        
        return Inertia::render('Projects/Edit', [
            'project' => $project,
            'users' => $users,
        ]);
    }

    public function update(Request $request, Project $project)
    {
        $this->authorize('update', $project);
        
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'status' => 'required|in:pending,in_progress,completed,cancelled',
            'users' => 'required|array|min:1',
            'users.*' => 'exists:users,id',
        ]);

        $project->update([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'status' => $validated['status'],
        ]);

        $project->users()->sync($validated['users']);

        return redirect()->route('projects.index')
            ->with('success', 'Proyecto actualizado exitosamente.');
    }

    public function destroy(Project $project)
    {
        $this->authorize('delete', $project);
        
        $project->delete();

        return redirect()->route('projects.index')
            ->with('success', 'Proyecto eliminado exitosamente.');
    }
}
