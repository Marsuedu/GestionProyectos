import React from 'react';
import { Head, Link } from '@inertiajs/react';

interface Role { id: number; name: string }
interface Project { id: number; title: string }
interface Task { id: number; title: string; project?: Project }

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  is_enabled: boolean;
  roles: Role[];
  projects?: Project[];
  assigned_tasks?: Task[];
}

export default function Show({ user }: { user: User }) {
  return (
    <div className="w-full min-h-screen m-0 bg-gray-100 dark:bg-black text-gray-900 dark:text-white py-10 px-4">
      <div className="max-w-4xl mx-auto p-6 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white shadow-lg border border-gray-200 dark:border-slate-700">
        <Head title={`Usuario - ${user.name}`} />
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Detalle de Usuario</h1>
          <div className="space-x-3">
            <Link href={route('users.edit', user.id)} className="text-green-600 hover:underline">Editar</Link>
            <Link href={route('users.index')} className="text-blue-600 hover:underline">Volver</Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded p-4">
            <h2 className="font-semibold mb-2">Información</h2>
            <p><span className="font-medium">Nombre:</span> {user.name}</p>
            <p><span className="font-medium">Email:</span> {user.email}</p>
            <p><span className="font-medium">Teléfono:</span> {user.phone || '-'}</p>
            <p><span className="font-medium">Estado:</span> {user.is_enabled ? 'Habilitado' : 'Deshabilitado'}</p>
            <p><span className="font-medium">Roles:</span> {user.roles.map(r => r.name).join(', ')}</p>
          </div>

          <div className="border rounded p-4">
            <h2 className="font-semibold mb-2">Proyectos</h2>
            {user.projects && user.projects.length > 0 ? (
              <ul className="list-disc ms-5">
                {user.projects.map(p => (
                  <li key={p.id}>{p.title}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">Sin proyectos</p>
            )}
          </div>
        </div>

        <div className="border rounded p-4 mt-4">
          <h2 className="font-semibold mb-2">Tareas Asignadas</h2>
          {user.assigned_tasks && user.assigned_tasks.length > 0 ? (
            <ul className="list-disc ms-5">
              {user.assigned_tasks.map(t => (
                <li key={t.id}>{t.title}{t.project ? ` - ${t.project.title}` : ''}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">Sin tareas asignadas</p>
          )}
        </div>
      </div>
    </div>
  );
}
