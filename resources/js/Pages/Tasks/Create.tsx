import React from 'react';
import { Head, useForm } from '@inertiajs/react';

interface Project {
  id: number;
  title: string;
}

interface User {
  id: number;
  name: string;
}

interface Props {
  projects: Project[];
  users: User[];
}

export default function Create({ projects, users }: Props) {
  const { data, setData, post, processing, errors, reset } = useForm({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    project_id: '' as number | string,
    assigned_user_id: '' as number | string,
    files: [] as File[],
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    post('/tasks', {
      forceFormData: true,
      onSuccess: () => reset(),
    });
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Head title="Crear Tarea" />
      <h1 className="text-2xl font-semibold mb-6">Crear Tarea</h1>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Título</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={data.title}
            onChange={(e) => setData('title', e.target.value)}
          />
          {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Archivos (PDF, DOC, DOCX, JPG)</label>
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.jpg,.jpeg"
            className="w-full text-sm"
            onChange={(e) => {
              const files = Array.from(e.target.files ?? []);
              setData('files', files as File[]);
            }}
          />
          {errors.files && (
            <p className="text-red-600 text-sm mt-1">{(errors.files as any) ?? ''}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            rows={4}
            value={data.description}
            onChange={(e) => setData('description', e.target.value)}
          />
          {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Fecha de inicio</label>
            <input
              type="date"
              className="w-full border rounded px-3 py-2"
              value={data.start_date}
              onChange={(e) => setData('start_date', e.target.value)}
            />
            {errors.start_date && <p className="text-red-600 text-sm mt-1">{errors.start_date}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Fecha de fin</label>
            <input
              type="date"
              className="w-full border rounded px-3 py-2"
              value={data.end_date}
              onChange={(e) => setData('end_date', e.target.value)}
            />
            {errors.end_date && <p className="text-red-600 text-sm mt-1">{errors.end_date}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Proyecto</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={data.project_id}
              onChange={(e) => setData('project_id', e.target.value)}
            >
              <option value="">Seleccione un proyecto</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
            {errors.project_id && <p className="text-red-600 text-sm mt-1">{errors.project_id}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Asignado a</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={data.assigned_user_id}
              onChange={(e) => setData('assigned_user_id', e.target.value)}
            >
              <option value="">Seleccione un usuario</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
            {errors.assigned_user_id && (
              <p className="text-red-600 text-sm mt-1">{errors.assigned_user_id}</p>
            )}
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={processing}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {processing ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
}
