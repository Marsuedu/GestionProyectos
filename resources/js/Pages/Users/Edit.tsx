import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

// 1. Ajustamos la interfaz: 'roles' ahora es un array de textos (string[])
interface User { 
    id: number; 
    name: string; 
    email: string; 
    phone?: string | null; 
    is_enabled: boolean | number; // Puede venir como 1/0 o true/false
    roles: string[] | null;       // <--- CAMBIO CLAVE: Es JSON, son strings.
}

// 2. Definimos los roles disponibles aquí (para no depender de tablas externas)
const AVAILABLE_ROLES = ['Administrador', 'Responsable de proyecto', 'Responsable de tarea'];

export default function Edit({ user }: { user: User }) {
  
  // 3. Inicializamos el formulario adaptado al formato JSON
  const { data, setData, put, processing, errors, reset } = useForm({
    name: user.name || '',
    email: user.email || '',
    password: '',
    password_confirmation: '',
    phone: user.phone || '',
    // Aseguramos que sea booleano real
    is_enabled: Boolean(user.is_enabled), 
    // Si es null (usuario antiguo), usamos array vacío
    roles: Array.isArray(user.roles) ? user.roles : [], 
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    put(route('users.update', user.id), {
      onSuccess: () => reset('password', 'password_confirmation'),
    });
  }

  // Función para manejar el cambio de checkboxes (Array de Strings)
  const handleRoleChange = (role: string, checked: boolean) => {
    let newRoles = [...data.roles];
    if (checked) {
        newRoles.push(role);
    } else {
        newRoles = newRoles.filter(r => r !== role);
    }
    setData('roles', newRoles);
  };

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
              <label className="inline-flex items-center gap-2 text-gray-800 dark:text-gray-200 cursor-pointer">
                <input 
                    className="rounded border-gray-300 dark:border-slate-700 dark:bg-slate-900 text-blue-600 focus:ring-blue-500" 
                    type="checkbox" 
                    checked={data.is_enabled} 
                    onChange={(e) => setData('is_enabled', e.target.checked)} 
                />
                <span className="text-sm select-none">Habilitado</span>
              </label>
              {/* @ts-ignore */}
              {errors.is_enabled && <p className="text-red-600 text-sm mt-1">{errors.is_enabled}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Roles</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* 4. Usamos la lista de roles fijos */}
              {AVAILABLE_ROLES.map((roleName) => {
                const checked = data.roles.includes(roleName);
                return (
                  <label key={roleName} className="inline-flex items-center gap-2 border rounded px-3 py-2 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/50">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 dark:border-slate-700 dark:bg-slate-900 text-blue-600 focus:ring-blue-500"
                      checked={checked}
                      onChange={(e) => handleRoleChange(roleName, e.target.checked)}
                    />
                    <span className="text-sm select-none">{roleName}</span>
                  </label>
                );
              })}
            </div>
            {/* @ts-ignore */}
            {errors.roles && <p className="text-red-600 text-sm mt-1">{errors.roles}</p>}
          </div>

          <div className="pt-2">
            <button type="submit" disabled={processing} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50 font-medium shadow-sm transition-colors">
              {processing ? 'Guardando...' : 'Actualizar Usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}