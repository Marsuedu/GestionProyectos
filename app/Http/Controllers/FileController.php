<?php

namespace App\Http\Controllers;

use App\Models\File;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'file' => 'required|file|mimes:pdf,doc,docx,jpg,jpeg|max:5120', // 5MB max
            'fileable_type' => 'required|in:App\Models\Project,App\Models\Task',
            'fileable_id' => 'required|integer',
        ]);

        // Verify the fileable model exists and user has access
        $fileableClass = $validated['fileable_type'];
        $fileable = $fileableClass::findOrFail($validated['fileable_id']);
        
        if ($fileable instanceof Project) {
            $this->authorize('view', $fileable);
        } elseif ($fileable instanceof Task) {
            $this->authorize('view', $fileable);
        }

        $file = $request->file('file');
        $fileName = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('uploads', $fileName, 'public');

        File::create([
            'name' => $fileName,
            'original_name' => $file->getClientOriginalName(),
            'path' => $path,
            'size' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
            'fileable_type' => $validated['fileable_type'],
            'fileable_id' => $validated['fileable_id'],
            'uploaded_by' => auth()->id(),
        ]);

        return back()->with('success', 'Archivo subido exitosamente.');
    }

    public function download(File $file)
    {
        // Check if user has access to the file's parent model
        if ($file->fileable instanceof Project) {
            $this->authorize('view', $file->fileable);
        } elseif ($file->fileable instanceof Task) {
            $this->authorize('view', $file->fileable);
        }

        if (!Storage::disk('public')->exists($file->path)) {
            abort(404, 'Archivo no encontrado.');
        }

        return Storage::disk('public')->download($file->path, $file->original_name);
    }

    public function destroy(File $file)
    {
        // Check if user has access to delete the file
        if ($file->fileable instanceof Project) {
            $this->authorize('update', $file->fileable);
        } elseif ($file->fileable instanceof Task) {
            $this->authorize('update', $file->fileable);
        }

        if (Storage::disk('public')->exists($file->path)) {
            Storage::disk('public')->delete($file->path);
        }

        $file->delete();

        return back()->with('success', 'Archivo eliminado exitosamente.');
    }
}
