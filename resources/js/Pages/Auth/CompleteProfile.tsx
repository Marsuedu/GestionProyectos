import { Head, useForm } from "@inertiajs/react";

export default function CompleteProfile() {
    const form = useForm({
        phone: "",
        is_active: true,
        roles: [] as string[],
    });

    const handleRoleChange = (role: string, checked: boolean) => {
        let newRoles = [...form.data.roles];
        if (checked) {
            newRoles.push(role);
        } else {
            newRoles = newRoles.filter((r) => r !== role);
        }
        form.setData("roles", newRoles);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(route("profile.complete.store"));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-900 p-4">
            <Head title="Completar Perfil" />
            
            <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 text-gray-900 dark:text-white">
                <h2 className="text-2xl font-bold mb-6">Completa tu información</h2>

                <form onSubmit={submit} className="space-y-6">
                    {/* TELEFONO & HABILITADO */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        <div>
                            <label className="block text-sm font-medium mb-2">Teléfono</label>
                            <input 
                                type="text" 
                                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition"
                                value={form.data.phone}
                                onChange={e => form.setData('phone', e.target.value)}
                            />
                            {/* MUESTRA ERROR DE TELÉFONO SI EXISTE */}
                            {form.errors.phone && (
                                <div className="text-red-500 text-sm mt-1">{form.errors.phone}</div>
                            )}
                        </div>
                        
                        <div className="flex flex-col pb-1">
                            <div className="flex items-center">
                                <input 
                                    type="checkbox" 
                                    id="active"
                                    checked={form.data.is_active}
                                    onChange={e => form.setData('is_active', e.target.checked)}
                                    className="w-5 h-5 text-blue-600 rounded bg-gray-50 dark:bg-slate-900 border-gray-300 focus:ring-blue-500"
                                />
                                <label htmlFor="active" className="ml-2 text-sm font-medium cursor-pointer">Habilitado</label>
                            </div>
                            {/* MUESTRA ERROR DE IS_ACTIVE SI EXISTE */}
                            {form.errors.is_active && (
                                <div className="text-red-500 text-sm mt-1">{form.errors.is_active}</div>
                            )}
                        </div>
                    </div>

                    {/* ROLES */}
                    <div>
                        <label className="block text-sm font-medium mb-3">Roles</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {['Responsable de proyecto', 'Responsable de tarea'].map((role) => (
                                <div key={role} className="flex items-center p-3 border border-gray-200 dark:border-slate-700 rounded-md bg-gray-50 dark:bg-slate-900/50 hover:bg-gray-100 dark:hover:bg-slate-800 transition">
                                    <input 
                                        type="checkbox" 
                                        id={role}
                                        value={role}
                                        checked={form.data.roles.includes(role)}
                                        onChange={(e) => handleRoleChange(role, e.target.checked)}
                                        className="w-5 h-5 text-blue-600 rounded bg-slate-900 border-slate-600 focus:ring-blue-500 cursor-pointer"
                                    />
                                    <label htmlFor={role} className="ml-2 text-sm cursor-pointer select-none">{role}</label>
                                </div>
                            ))}
                        </div>
                        {/* MUESTRA ERROR DE ROLES SI EXISTE */}
                        {form.errors.roles && (
                            <div className="text-red-500 text-sm mt-2">{form.errors.roles}</div>
                        )}
                    </div>

                    {/* BOTON */}
                    <div className="flex justify-end pt-4">
                        <button 
                            type="submit" 
                            className={`bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-md transition shadow-md
                                ${form.processing ? 'opacity-70 cursor-not-allowed' : ''}
                            `}
                            disabled={form.processing}
                        >
                            {form.processing ? 'Guardando...' : 'Guardar y Continuar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}