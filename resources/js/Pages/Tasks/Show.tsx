import { Head, Link } from '@inertiajs/react';
import type React from 'react';
import FileUpload from '@/Components/FileUpload';

// Ziggy route helper
declare const route: (name: string, params?: any) => string;

interface User { id: number; name: string }
interface Project { id: number; title: string }

interface FileItem {
  id: number;
  name: string;
  original_name: string;
  uploaded_by: { id: number; name: string };
}

interface TaskProps {
  task: {
    id: number;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    status: 'pending' | 'in_progress' | 'completed';
    project: Project;
    assigned_user: User;
    creator: User;
    files?: FileItem[];
  }
}

export default function Show({ task }: TaskProps) {
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

  const statusMeta: Record<string, { label: string; cls: string }> = {
    pending: { label: 'Pendiente', cls: 'bg-gray-100 text-gray-800' },
    in_progress: { label: 'En Progreso', cls: 'bg-blue-100 text-blue-800' },
    completed: { label: 'Completada', cls: 'bg-green-100 text-green-800' },
  };

  const statusInfo = statusMeta[task.status] ?? statusMeta.pending;
  return (
    <div className="w-full min-h-screen m-0 bg-gray-100 dark:bg-black text-gray-900 dark:text-white py-10 px-4">
      <div className="p-6 max-w-3xl mx-auto rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white shadow-lg border border-gray-200 dark:border-slate-700">
        <Head title={`Tarea: ${task.title}`} />

        <h1 className="text-2xl font-semibold mb-4">{task.title}</h1>

        <div className="space-y-4 mb-6">
          <p><strong>Proyecto:</strong> {task.project.title}</p>
          <p><strong>Asignado a:</strong> {task.assigned_user.name}</p>
          <p><strong>Creado por:</strong> {task.creator.name}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-lg border border-gray-200 p-4 bg-white">
              <p className="text-xs text-gray-500">Fecha de inicio</p>
              <p className="text-base font-medium text-gray-900">{formatDate(task.start_date)}</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4 bg-white">
              <p className="text-xs text-gray-500">Fecha de fin</p>
              <p className="text-base font-medium text-gray-900">{formatDate(task.end_date)}</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4 bg-white">
              <p className="text-xs text-gray-500">Estado</p>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusInfo.cls}`}>
                {statusInfo.label}
              </span>
            </div>
          </div>
          <p className="mt-2 whitespace-pre-wrap">{task.description}</p>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Archivos</h2>
          <div className="mb-4">
            <FileUpload fileableType="App\Models\Task" fileableId={task.id} />
          </div>
          {task.files && task.files.length > 0 ? (
            <ul className="space-y-2">
              {task.files.map((f) => (
                <li key={f.id} className="flex items-center justify-between gap-3">
                  <div>
                    <span className="font-medium">{f.original_name ?? f.name}</span>
                    <span className="text-sm text-gray-600"> — subido por {f.uploaded_by.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={route('files.download', f.id)}
                      className="px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Descargar
                    </a>
                    <Link
                      href={route('files.destroy', f.id)}
                      method="delete"
                      as="button"
                      className="px-2 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Eliminar
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-600">No hay archivos adjuntos.</p>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <Link
            href={route('tasks.edit', task.id)}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Editar
          </Link>
          <Link
            href={route('tasks.index')}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Volver
          </Link>
        </div>
      </div>
    </div>
  );
}
