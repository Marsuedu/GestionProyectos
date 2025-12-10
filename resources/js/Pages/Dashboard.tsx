import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps, DashboardStats, Project, Task } from '@/types';

interface DashboardProps extends PageProps {
    stats: DashboardStats;
    recentProjects: Project[];
    myTasks: Task[];
    tasksByProject: Project[];
}

export default function Dashboard({ stats, recentProjects, myTasks, tasksByProject }: DashboardProps) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-white">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            {/* ======== CONTENIDO PRINCIPAL ======== */}
            <div className="py-10">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">

                    {/* ======== TARJETAS DE ESTADÍSTICAS ======== */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-10">

                        {/* Card genérica */}
                        {[
                            { label: "Total Proyectos", value: stats.total_projects, color: "bg-blue-600" },
                            { label: "Total Tareas", value: stats.total_tasks, color: "bg-green-600" },
                            { label: "Tareas Pendientes", value: stats.pending_tasks, color: "bg-yellow-500" },
                            { label: "Tareas Completadas", value: stats.completed_tasks, color: "bg-emerald-600" }
                        ].map((item, idx) => (
                            <div key={idx} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
                                <div className="flex items-center">
                                    <div className={`w-10 h-10 ${item.color} rounded-md flex items-center justify-center shadow`}>
                                        <span className="text-white text-lg font-bold">✓</span>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.label}</p>
                                        <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">{item.value}</p>
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>

                    {/* ======== SECCIÓN DOS COLUMNAS ======== */}
                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">

                        {/* === PROYECTOS RECIENTES === */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Proyectos Recientes</h3>
                                <Link
                                    href={route('projects.index')}
                                    className="text-sm font-medium text-blue-600 hover:underline"
                                >
                                    Ver todos
                                </Link>
                            </div>

                            <div className="space-y-3">
                                {recentProjects.length > 0 ? (
                                    recentProjects.map((project) => (
                                        <div key={project.id} className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 transition hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700">
                                            <div>
                                                <Link
                                                    href={route('projects.show', project.id)}
                                                    className="text-sm font-semibold text-blue-600 hover:underline"
                                                >
                                                    {project.title}
                                                </Link>
                                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                    {new Date(project.start_date).toLocaleDateString('es-ES')} - {new Date(project.end_date).toLocaleDateString('es-ES')}
                                                </p>
                                            </div>

                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium
                                                ${project.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                    project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                                        project.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                            'bg-gray-100 text-gray-800'}`}>
                                                {project.status === 'completed'
                                                    ? 'Completado'
                                                    : project.status === 'in_progress'
                                                        ? 'En Progreso'
                                                        : project.status === 'cancelled'
                                                            ? 'Cancelado'
                                                            : 'Pendiente'
                                                }
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                        No hay proyectos recientes
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* === MIS TAREAS === */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Mis Tareas</h3>
                                <Link
                                    href={route('tasks.index')}
                                    className="text-sm font-medium text-blue-600 hover:underline"
                                >
                                    Ver todas
                                </Link>
                            </div>

                            <div className="space-y-3">
                                {myTasks.length > 0 ? (
                                    myTasks.map((task) => (
                                        <div key={task.id} className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 transition hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700">
                                            <div>
                                                <Link
                                                    href={route('tasks.show', task.id)}
                                                    className="text-sm font-semibold text-blue-600 hover:underline"
                                                >
                                                    {task.title}
                                                </Link>
                                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                    {task.project?.title} • Vence: {new Date(task.end_date).toLocaleDateString('es-ES')}
                                                </p>
                                            </div>

                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium
                                                ${task.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                    task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-gray-100 text-gray-800'}`}>
                                                {task.status === 'completed'
                                                    ? 'Completada'
                                                    : task.status === 'in_progress'
                                                        ? 'En Progreso'
                                                        : 'Pendiente'
                                                }
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                        No tienes tareas asignadas
                                    </p>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
