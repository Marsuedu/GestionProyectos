import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

interface Role { id: number; name: string }
interface User { id: number; name: string; email: string; phone?: string | null; is_enabled: boolean; roles: Role[] }

export default function Edit({ user, roles }: { user: User; roles: Role[] }) {
  const roleIds = user.roles.map(r => r.id);
  const { data, setData, put, processing, errors, reset } = useForm({
    name: user.name || '',
    email: user.email || '',
    password: '',
    password_confirmation: '',
    phone: user.phone || '',
    is_enabled: user.is_enabled,
    roles: roleIds as number[],
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    put(route('users.update', user.id), {
      onSuccess: () => reset('password', 'password_confirmation'),
    });
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 text-gray-900 dark:bg-black dark:text-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto p-6 rounded-lg bg-white dark:bg-slate-800 shadow-md border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white">
        <Head title={`Editar Usuario - ${user.name}`} />
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Editar Usuario</h1>
          <Link href={route('users.index')} className="text-blue-600 hover:underline">Volver</Link>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Nombre</label>
            <input className="w-full rounded border px-3 py-2 text-gray-900 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100" value={data.name} onChange={(e) => setData('name', e.target.value)} />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Email</label>
            <input type="email" className="w-full rounded border px-3 py-2 text-gray-900 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100" value={data.email} onChange={(e) => setData('email', e.target.value)} />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Nueva contraseña (opcional)</label>
              <input type="password" className="w-full rounded border px-3 py-2 text-gray-900 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100" value={data.password} onChange={(e) => setData('password', e.target.value)} />
              {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Confirmar contraseña</label>
              <input type="password" className="w-full rounded border px-3 py-2 text-gray-900 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} />
              {errors.password_confirmation && <p className="text-red-600 text-sm mt-1">{errors.password_confirmation as unknown as string}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Teléfono</label>
              <input className="w-full rounded border px-3 py-2 text-gray-900 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
              {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
            </div>
            <div className="pt-6">
              <label className="inline-flex items-center gap-2 text-gray-800 dark:text-gray-200">
                <input className="rounded border-gray-300 dark:border-slate-700 dark:bg-slate-900" type="checkbox" checked={data.is_enabled} onChange={(e) => setData('is_enabled', e.target.checked)} />
                <span className="text-sm">Habilitado</span>
              </label>
              {errors.is_enabled && <p className="text-red-600 text-sm mt-1">{errors.is_enabled as unknown as string}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Roles</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {roles.map((r) => {
                const checked = data.roles.includes(r.id);
                return (
                  <label key={r.id} className="inline-flex items-center gap-2 border rounded px-3 py-2 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 dark:border-slate-700 dark:bg-slate-900"
                      checked={checked}
                      onChange={(e) => {
                        if (e.target.checked) setData('roles', [...data.roles, r.id]);
                        else setData('roles', data.roles.filter((id) => id !== r.id));
                      }}
                    />
                    <span className="text-sm">{r.name}</span>
                  </label>
                );
              })}
            </div>
            {errors.roles && <p className="text-red-600 text-sm mt-1">{errors.roles as unknown as string}</p>}
          </div>

          <div className="pt-2">
            <button type="submit" disabled={processing} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50">
              {processing ? 'Guardando...' : 'Actualizar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
