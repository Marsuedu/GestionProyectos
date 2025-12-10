import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps, Task, PaginatedData } from '@/types';
import { useMemo } from 'react';

interface TasksIndexProps extends PageProps {
    tasks: PaginatedData<Task>;
}

export default function TasksIndex({ tasks }: TasksIndexProps) {
    const handleStatusUpdate = (taskId: number, status: string) => {
        router.patch(route('tasks.update-status', taskId), { status }, {
            preserveScroll: true,
        });
    };

    const perPageOptions = [10, 25, 50, 100];
    const currentPerPage = useMemo(() => (tasks as any)?.per_page ?? 10, [tasks]);
    const handlePerPageChange = (value: number) => {
        router.get(route('tasks.index'), { per_page: value }, { preserveScroll: true, preserveState: true, replace: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-white">
                        Tareas
                    </h2>
                    <Link
                        href={route('tasks.create')}
                        className="rounded-md bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700"
                    >
                        Nueva Tarea
                    </Link>
                </div>
            }
        >
            <Head title="Tareas" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
                        <div className="p-6">
                            <div className="flex items-center justify-end pb-4">
                                <label className="mr-2 text-sm text-gray-600 dark:text-gray-300">Mostrar</label>
                                <select
                                    className="rounded border px-2 py-1 text-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-200"
                                    value={currentPerPage}
                                    onChange={(e) => handlePerPageChange(Number(e.target.value))}
                                >
                                    {perPageOptions.map((n) => (
                                        <option key={n} value={n}>{n}</option>
                                    ))}
                                </select>
                                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">por página</span>
                            </div>
                            {tasks.data.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-800/70">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
                                                    Tarea
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
                                                    Proyecto
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
                                                    Asignado a
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
                                                    Fechas
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
                                                    Estado
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
                                                    Acciones
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                                            {tasks.data.map((task) => (
                                                <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        <div>
                                                            <Link
                                                                href={route('tasks.show', task.id)}
                                                                className="text-sm font-medium text-blue-600 hover:text-blue-500"
                                                            >
                                                                {task.title}
                                                            </Link>
                                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                                {task.description.length > 80
                                                                    ? `${task.description.substring(0, 80)}...`
                                                                    : task.description}
                                                            </p>
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                                        <Link
                                                            href={route('projects.show', task.project?.id)}
                                                            className="text-blue-600 hover:text-blue-500"
                                                        >
                                                            {task.project?.title}
                                                        </Link>
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                                        <div className="flex items-center">
                                                            <div className="mr-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-500 text-xs font-medium text-white">
                                                                {task.assigned_user?.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                            </div>
                                                            {task.assigned_user?.name}
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                                        <div>
                                                            <p>Inicio: {new Date(task.start_date).toLocaleDateString('es-ES')}</p>
                                                            <p>Fin: {new Date(task.end_date).toLocaleDateString('es-ES')}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <select
                                                            value={task.status}
                                                            onChange={(e) => handleStatusUpdate(task.id, e.target.value)}
                                                            className={`text-xs font-medium rounded-full px-2.5 py-0.5 border-0 ${
                                                                task.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                                task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                                                'bg-gray-100 text-gray-800'
                                                            }`}
                                                        >
                                                            <option value="pending">Pendiente</option>
                                                            <option value="in_progress">En Progreso</option>
                                                            <option value="completed">Completada</option>
                                                        </select>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex justify-end space-x-2">
                                                            <Link
                                                                href={route('tasks.show', task.id)}
                                                                className="text-blue-600 hover:text-blue-800"
                                                            >
                                                                Ver
                                                            </Link>
                                                            <Link
                                                                href={route('tasks.edit', task.id)}
                                                                className="text-indigo-600 hover:text-indigo-800"
                                                            >
                                                                Editar
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="py-12 text-center">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No hay tareas</h3>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Comienza creando una nueva tarea.</p>
                                    <div className="mt-6">
                                        <Link
                                            href={route('tasks.create')}
                                            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                                        >
                                            Crear Tarea
                                        </Link>
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center justify-between pt-6">
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    Página {(tasks as any).current_page} de {(tasks as any).last_page}
                                </div>
                                <nav className="flex items-center space-x-1">
                                    {((tasks as any).links ?? []).map((link: any, idx: number) => (
                                        <Link
                                            key={idx}
                                            href={link.url || ''}
                                            preserveScroll
                                            preserveState
                                            className={`px-3 py-1 rounded border text-sm ${
                                                link.active
                                                    ? 'bg-blue-600 text-white border-blue-600'
                                                    : link.url
                                                    ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-zinc-900 dark:text-gray-200 dark:border-zinc-800 dark:hover:bg-zinc-800'
                                                    : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed dark:bg-zinc-900 dark:text-gray-500 dark:border-zinc-800'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
