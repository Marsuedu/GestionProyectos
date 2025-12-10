import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Role { id: number; name: string }

export default function Create({ roles }: { roles: Role[] }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    is_enabled: true as boolean,
    roles: [] as number[],
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    post('/users', {
      onSuccess: () => reset('password', 'password_confirmation'),
    });
  }

  return (
    <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Crear Usuario</h2>}>
      <Head title="Crear Usuario" />
      <div className="max-w-3xl mx-auto p-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Crear Usuario</h1>
          <Link href={route('users.index')} className="text-blue-600 hover:underline">Volver</Link>
        </div>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input className="w-full border rounded px-3 py-2" value={data.name} onChange={(e) => setData('name', e.target.value)} />
          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" className="w-full border rounded px-3 py-2" value={data.email} onChange={(e) => setData('email', e.target.value)} />
          {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Contraseña</label>
            <input type="password" className="w-full border rounded px-3 py-2" value={data.password} onChange={(e) => setData('password', e.target.value)} />
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Confirmar contraseña</label>
            <input type="password" className="w-full border rounded px-3 py-2" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} />
            {errors.password_confirmation && <p className="text-red-600 text-sm mt-1">{errors.password_confirmation as unknown as string}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Teléfono</label>
            <input className="w-full border rounded px-3 py-2" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
            {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
          </div>
          <div className="pt-6">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={data.is_enabled} onChange={(e) => setData('is_enabled', e.target.checked)} />
              <span className="text-sm">Habilitado</span>
            </label>
            {errors.is_enabled && <p className="text-red-600 text-sm mt-1">{errors.is_enabled as unknown as string}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Roles</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {roles.map((r) => {
              const checked = data.roles.includes(r.id);
              return (
                <label key={r.id} className="inline-flex items-center gap-2 border rounded px-3 py-2">
                  <input
                    type="checkbox"
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
          <button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50">
            {processing ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
      </div>
    </AuthenticatedLayout>
  );
}
