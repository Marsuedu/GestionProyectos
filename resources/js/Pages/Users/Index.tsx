import React from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react'; // <--- 1. IMPORTAMOS router y usePage
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';

interface Role { id: number; name: string }
interface User { id: number; name: string; email: string; is_enabled: boolean; roles: Role[] }

interface PaginationLink { url: string | null; label: string; active: boolean }
interface Paginated<T> {
  data: T[];
  links: PaginationLink[];
}

// Extendemos PageProps para incluir roles en auth (para que TypeScript no se queje)
interface ExtendedPageProps extends PageProps {
    auth: PageProps['auth'] & {
        roles: string[];
    }
}

export default function Index({ users }: { users: Paginated<User> }) {
  // 2. OBTENEMOS LOS ROLES Y CALCULAMOS isAdmin
  const { auth } = usePage<ExtendedPageProps>().props;
  
  // Debug: Puedes ver esto en la consola del navegador (F12)
  console.log('Roles del usuario actual:', auth.roles);

  const isAdmin = auth.roles?.includes('Administrador');

  return (
    <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-white">Usuarios</h2>}>
      <Head title="Usuarios" />
      <div className="mx-auto max-w-7xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Listado</h1>
          <Link href={route('users.create')} className="rounded-md bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700">Nuevo Usuario</Link>
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800/70">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">Roles</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {users.data.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{u.name}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{u.email}</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${u.is_enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {u.is_enabled ? 'Habilitado' : 'Deshabilitado'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex flex-wrap gap-2">
                        {u.roles.length > 0 ? (
                          u.roles.map((r) => (
                            <span key={r.id} className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                              {r.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-500">Sin roles</span>
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Link href={route('users.show', u.id)} className="text-blue-600 hover:text-blue-800">Ver</Link>
                        <Link href={route('users.edit', u.id)} className="text-indigo-600 hover:text-indigo-800">Editar</Link>
                        
                        {/* 3. AQUI ESTA EL BOTON DE ELIMINAR (SOLO PARA ADMINS) */}
                        {isAdmin && (
                            <button
                                onClick={() => {
                                    if (confirm('¿Estás seguro de que quieres eliminar a este usuario? Esta acción no se puede deshacer.')) {
                                        router.delete(route('users.destroy', u.id));
                                    }
                                }}
                                className="text-red-600 hover:text-red-900 ml-2 font-bold"
                            >
                                Eliminar
                            </button>
                        )}

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {users.links.map((l, i) => (
            <Link
              key={i}
              href={l.url || '#'}
              className={`px-3 py-1 rounded border ${l.active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800'} ${!l.url ? 'opacity-50 cursor-not-allowed' : ''}`}
              preserveScroll
            >
              <span dangerouslySetInnerHTML={{ __html: l.label }} />
            </Link>
          ))}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}