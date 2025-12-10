import { Head, Link, useForm } from '@inertiajs/react';
import type React from 'react';

// Ziggy route helper
declare const route: (name: string, params?: any) => string;

interface User { id: number; name: string }
interface Project { id: number; title: string }

interface Task {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  status: 'pending' | 'in_progress' | 'completed';
  project_id: number;
  assigned_user_id: number;
}

interface EditProps {
  task: Task;
  users: User[];
  projects: Project[];
}

export default function Edit({ task, users, projects }: EditProps) {
  const { data, setData, put, processing, errors } = useForm({
    title: task.title,
    description: task.description,
    start_date: task.start_date,
    end_date: task.end_date,
    status: task.status,
    project_id: task.project_id,
    assigned_user_id: task.assigned_user_id,
  });

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    put(route('tasks.update', task.id));
  };

  return (
    <div className="w-full min-h-screen m-0 bg-gray-100 dark:bg-black text-gray-900 dark:text-white py-10 px-4">
      <div className="mx-auto max-w-3xl p-6 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white shadow-lg border border-gray-200 dark:border-slate-700">
        <Head title={`Editar tarea: ${task.title}`} />

        <h1 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">Editar tarea</h1>

        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <form onSubmit={submit} className="space-y-4 p-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Título</label>
              <input
                type="text"
                className="mt-1 w-full rounded border px-3 py-2 text-gray-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-100"
                value={data.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('title', e.target.value)}
              />
              {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descripción</label>
              <textarea
                className="mt-1 w-full rounded border px-3 py-2 text-gray-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-100"
                value={data.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('description', e.target.value)}
              />
              {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha de inicio</label>
                <input
                  type="date"
                  className="mt-1 w-full rounded border px-3 py-2 text-gray-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-100"
                  value={data.start_date}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('start_date', e.target.value)}
                />
                {errors.start_date && <p className="text-sm text-red-600">{errors.start_date}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha de fin</label>
                <input
                  type="date"
                  className="mt-1 w-full rounded border px-3 py-2 text-gray-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-100"
                  value={data.end_date}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('end_date', e.target.value)}
                />
                {errors.end_date && <p className="text-sm text-red-600">{errors.end_date}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Estado</label>
                <select
                  className="mt-1 w-full rounded border px-3 py-2 text-gray-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-100"
                  value={data.status}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setData('status', e.target.value as Task['status'])}
                >
                  <option value="pending">Pendiente</option>
                  <option value="in_progress">En progreso</option>
                  <option value="completed">Completada</option>
                </select>
                {errors.status && <p className="text-sm text-red-600">{errors.status}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Proyecto</label>
                <select
                  className="mt-1 w-full rounded border px-3 py-2 text-gray-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-100"
                  value={data.project_id}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setData('project_id', Number(e.target.value))}
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
                {errors.project_id && <p className="text-sm text-red-600">{errors.project_id}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Asignado a</label>
              <select
                className="mt-1 w-full rounded border px-3 py-2 text-gray-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-100"
                value={data.assigned_user_id}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setData('assigned_user_id', Number(e.target.value))}
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
              {errors.assigned_user_id && <p className="text-sm text-red-600">{errors.assigned_user_id}</p>}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={processing}
                className="inline-flex items-center rounded bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700 disabled:opacity-50"
              >
                Guardar
              </button>
              <Link href={route('tasks.show', task.id)} className="rounded bg-gray-500 px-4 py-2 text-white shadow hover:bg-gray-600">
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
