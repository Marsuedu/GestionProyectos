import { Head, Link } from '@inertiajs/react';
import type React from 'react';
import FileUpload from '@/Components/FileUpload';

// Declaración del helper global route()
declare const route: (name: string, params?: any) => string;

interface User {
  id: number;
  name: string;
}

interface Task {
  id: number;
  title: string;
  status: string;
  assigned_user?: User | null;
}

interface FileItem {
  id: number;
  name: string;
  original_name?: string;
  uploader: User;
}

interface Project {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  status: string;
  creator: User;
  users: User[];
  tasks: Task[];
  files?: FileItem[];
}

interface ShowProps {
  project: Project;
}

export default function Show({ project }: ShowProps) {
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

  const statusMeta: Record<string, { label: string; cls: string }> = {
    pending: { label: 'Pendiente', cls: 'bg-gray-100 text-gray-800' },
    in_progress: { label: 'En Progreso', cls: 'bg-blue-100 text-blue-800' },
    completed: { label: 'Completado', cls: 'bg-green-100 text-green-800' },
    cancelled: { label: 'Cancelado', cls: 'bg-red-100 text-red-800' },
  };

  const statusInfo = statusMeta[project.status] ?? statusMeta.pending;
  return (
    <div className="w-full min-h-screen m-0 bg-gray-100 dark:bg-black text-gray-900 dark:text-white py-10 px-4">
      <div className="max-w-4xl mx-auto p-6 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white shadow-lg border border-gray-200 dark:border-slate-700">
        <Head title={`Proyecto: ${project.title}`} />

        <h1 className="text-3xl font-semibold mb-4 text-gray-900 dark:text-gray-100">{project.title}</h1>

        <div className="space-y-4 mb-6">
          <p className="text-gray-800 dark:text-gray-200"><strong>Descripción:</strong> {project.description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-lg border border-gray-200 p-4 bg-white dark:border-slate-700 dark:bg-slate-800">
              <p className="text-xs text-gray-500">Fecha de inicio</p>
              <p className="text-base font-medium text-gray-900 dark:text-gray-100">{formatDate(project.start_date)}</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4 bg-white dark:border-slate-700 dark:bg-slate-800">
              <p className="text-xs text-gray-500">Fecha de fin</p>
              <p className="text-base font-medium text-gray-900 dark:text-gray-100">{formatDate(project.end_date)}</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4 bg-white dark:border-slate-700 dark:bg-slate-800">
              <p className="text-xs text-gray-500">Estado</p>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusInfo.cls}`}>
                {statusInfo.label}
              </span>
            </div>
          </div>
          <p className="text-gray-800 dark:text-gray-200"><strong>Creador:</strong> {project.creator.name}</p>
        </div>

        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Usuarios asignados</h2>
        <ul className="list-disc ml-6 mb-6">
          {project.users.map((u) => (
            <li key={u.id} className="text-gray-800 dark:text-gray-200">{u.name}</li>
          ))}
        </ul>

        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Tareas</h2>
        <ul className="list-disc ml-6 mb-6">
          {project.tasks.length === 0 && <p className="text-gray-700 dark:text-gray-300">No hay tareas registradas.</p>}
          {project.tasks.map((t) => (
            <li key={t.id} className="text-gray-800 dark:text-gray-200">
              {t.title} — <strong>{t.status}</strong>{' '}
              {t.assigned_user && <span>(Asignado a {t.assigned_user.name})</span>}
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Archivos</h2>
          {/* Subida de archivos al proyecto */}
          <div className="mb-4">
            <FileUpload fileableType="App\Models\Project" fileableId={project.id} />
          </div>
          {project.files && project.files.length > 0 ? (
            <ul className="space-y-2">
              {project.files.map((f) => (
                <li key={f.id} className="flex items-center justify-between gap-3 rounded-md border border-gray-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
                  <div>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{f.original_name ?? f.name}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-300"> — subido por {f.uploader.name}</span>
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
            <p className="text-sm text-gray-600 dark:text-gray-300">No hay archivos adjuntos.</p>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <Link
            href={route('projects.edit', project.id)}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Editar
          </Link>
          <Link
            href={route('projects.index')}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Volver
          </Link>
        </div>
      </div>
    </div>
  );
}
