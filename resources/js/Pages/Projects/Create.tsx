import { Head, useForm } from '@inertiajs/react';
import type React from 'react';

// Make TS aware of Ziggy's global route() without adding deps
declare const route: (name: string, params?: any) => string;

interface CreateProps {
  users: Array<{ id: number; name: string }>
}

export default function Create({ users }: CreateProps) {
  const { data, setData, post, processing, errors } = useForm({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    users: [] as number[],
    files: [] as File[],
  });

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    post(route('projects.store'), { forceFormData: true });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Head title="Crear proyecto" />
      <h1 className="text-2xl font-semibold mb-4">Crear proyecto</h1>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Título</label>
          <input
            type="text"
            className="mt-1 w-full border rounded px-3 py-2"
            value={data.title}
            onChange={(e) => setData('title', e.target.value)}
          />
          {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Archivos (PDF, DOC, DOCX, JPG)</label>
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.jpg,.jpeg"
            className="mt-1 w-full text-sm"
            onChange={(e) => {
              const files = Array.from(e.target.files ?? []);
              setData('files', files as File[]);
            }}
          />
          {errors.files && <p className="text-sm text-red-600">{errors.files as any}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Descripción</label>
          <textarea
            className="mt-1 w-full border rounded px-3 py-2"
            value={data.description}
            onChange={(e) => setData('description', e.target.value)}
          />
          {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Fecha de inicio</label>
            <input
              type="date"
              className="mt-1 w-full border rounded px-3 py-2"
              value={data.start_date}
              onChange={(e) => setData('start_date', e.target.value)}
            />
            {errors.start_date && <p className="text-sm text-red-600">{errors.start_date}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Fecha de fin</label>
            <input
              type="date"
              className="mt-1 w-full border rounded px-3 py-2"
              value={data.end_date}
              onChange={(e) => setData('end_date', e.target.value)}
            />
            {errors.end_date && <p className="text-sm text-red-600">{errors.end_date}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Usuarios asignados</label>
          <select
            multiple
            className="mt-1 w-full border rounded px-3 py-2 h-40"
            value={data.users.map(String)}
            onChange={(e) => {
              const options = Array.from(e.target.selectedOptions).map((o) => Number(o.value));
              setData('users', options);
            }}
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
          {errors.users && <p className="text-sm text-red-600">{errors.users}</p>}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={processing}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}
