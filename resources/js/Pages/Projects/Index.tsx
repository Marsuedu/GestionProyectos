import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps, Project, PaginatedData } from '@/types';
import { useMemo } from 'react';

interface ProjectsIndexProps extends PageProps {
    projects: PaginatedData<Project>;
}

export default function ProjectsIndex({ projects }: ProjectsIndexProps) {
    const perPageOptions = [10, 25, 50, 100];
    const currentPerPage = useMemo(() => (projects as any)?.per_page ?? 10, [projects]);
    const handlePerPageChange = (value: number) => {
        router.get(route('projects.index'), { per_page: value }, { preserveScroll: true, preserveState: true, replace: true });
    };
    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-white">
                        Proyectos
                    </h2>
                    <Link
                        href={route('projects.create')}
                        className="rounded-md bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700"
                    >
                        Nuevo Proyecto
                    </Link>
                </div>
            }
        >
            <Head title="Proyectos" />

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
                            {projects.data.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-800/70">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
                                                    Proyecto
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
                                                    Fechas
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
                                                    Estado
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
                                                    Tareas
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
                                                    Responsables
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
                                                    Acciones
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                                            {projects.data.map((project) => (
                                                <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        <div>
                                                            <Link
                                                                href={route('projects.show', project.id)}
                                                                className="text-sm font-medium text-blue-600 hover:text-blue-500"
                                                            >
                                                                {project.title}
                                                            </Link>
                                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                                {project.description.length > 100
                                                                    ? `${project.description.substring(0, 100)}...`
                                                                    : project.description}
                                                            </p>
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                                        <div>
                                                            <p>Inicio: {new Date(project.start_date).toLocaleDateString('es-ES')}</p>
                                                            <p>Fin: {new Date(project.end_date).toLocaleDateString('es-ES')}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                            project.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                            project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                                            project.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                            'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {project.status === 'completed' ? 'Completado' :
                                                             project.status === 'in_progress' ? 'En Progreso' :
                                                             project.status === 'cancelled' ? 'Cancelado' : 'Pendiente'}
                                                        </span>
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                                        {project.tasks_count || 0} tareas
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                                        <div className="flex -space-x-2">
                                                            {project.users?.slice(0, 3).map((user) => (
                                                                <div
                                                                    key={user.id}
                                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-500 text-xs font-medium text-white"
                                                                    title={user.name}
                                                                >
                                                                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                                </div>
                                                            ))}
                                                            {(project.users?.length || 0) > 3 && (
                                                                <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-xs font-medium text-gray-600 dark:bg-zinc-800 dark:text-gray-300">
                                                                    +{(project.users?.length || 0) - 3}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex justify-end space-x-2">
                                                            <Link
                                                                href={route('projects.show', project.id)}
                                                                className="text-blue-600 hover:text-blue-800"
                                                            >
                                                                Ver
                                                            </Link>
                                                            <Link
                                                                href={route('projects.edit', project.id)}
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
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No hay proyectos</h3>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Comienza creando un nuevo proyecto.</p>
                                    <div className="mt-6">
                                        <Link
                                            href={route('projects.create')}
                                            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                                        >
                                            Crear Proyecto
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {/* Pagination */}
                            {projects.data.length > 0 && projects.last_page > 1 && (
                                <div className="mt-6 flex items-center justify-between">
                                    <div className="flex-1 flex justify-between sm:hidden">
                                        {projects.prev_page_url && (
                                            <Link
                                                href={projects.prev_page_url}
                                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                            >
                                                Anterior
                                            </Link>
                                        )}
                                        {projects.next_page_url && (
                                            <Link
                                                href={projects.next_page_url}
                                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                            >
                                                Siguiente
                                            </Link>
                                        )}
                                    </div>
                                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                                Mostrando <span className="font-medium">{projects.from}</span> a{' '}
                                                <span className="font-medium">{projects.to}</span> de{' '}
                                                <span className="font-medium">{projects.total}</span> resultados
                                            </p>
                                        </div>
                                        <div>
                                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                                {projects.links.map((link, index) => (
                                                    <Link
                                                        key={index}
                                                        href={link.url || '#'}
                                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                            link.active
                                                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-800'
                                                        } ${index === 0 ? 'rounded-l-md' : ''} ${
                                                            index === projects.links.length - 1 ? 'rounded-r-md' : ''
                                                        }`}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                ))}
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
