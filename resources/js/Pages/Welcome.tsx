import { Head, Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import type React from 'react';

// Ziggy route helper
declare const route: (name: string, params?: any) => string;

// Route helper for checking if route exists
declare const Route: { has: (name: string) => boolean };

export default function Welcome({
    auth,
    laravelVersion,
    phpVersion,
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {
    const { props } = usePage<{ auth: { user: any; roles: string[] } }>();
    const isAdmin = (props?.auth?.roles || []).includes('Administrador');

    return (
        <>
            <Head title="Welcome" />
            <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen flex items-center justify-center">
                <div className="max-w-7xl mx-auto p-6 lg:p-8">
                    <div className="flex justify-center">
                        <svg viewBox="0 0 62 65" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500">
                            <path d="M61.5 28.5C61.5 43.6878 49.1878 56 34 56C18.8122 56 6.5 43.6878 6.5 28.5C6.5 13.3122 18.8122 1 34 1C49.1878 1 61.5 13.3122 61.5 28.5Z" fill="currentColor" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                    </div>

                    <div className="mt-6 text-center">
                        <h1 className="text-3xl font-bold">Welcome to Laravel</h1>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">
                            Laravel is a web application framework with expressive, elegant syntax.
                        </p>
                    </div>

                    <div className="mt-8 flex justify-center gap-4">
                        {auth.user ? (
                            <>
                                {isAdmin && (
                                    <Link
                                        href={route('dashboard')}
                                        className="inline-flex items-center px-4 py-2 bg-gray-800 dark:bg-white border border-transparent rounded-md font-semibold text-xs text-white dark:text-gray-800 uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-gray-200 active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:border-gray-900 dark:focus:border-white focus:ring focus:ring-gray-300 dark:focus:ring-gray-500 disabled:opacity-25 transition ease-in-out duration-150"
                                    >
                                        Dashboard
                                    </Link>
                                )}
                                <Link
                                    href={route('dashboard')}
                                    className="inline-flex items-center px-4 py-2 bg-gray-800 dark:bg-white border border-transparent rounded-md font-semibold text-xs text-white dark:text-gray-800 uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-gray-200 active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:border-gray-900 dark:focus:border-white focus:ring focus:ring-gray-300 dark:focus:ring-gray-500 disabled:opacity-25 transition ease-in-out duration-150"
                                >
                                    Dashboard
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="inline-flex items-center px-4 py-2 bg-gray-800 dark:bg-white border border-transparent rounded-md font-semibold text-xs text-white dark:text-gray-800 uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-gray-200 active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:border-gray-900 dark:focus:border-white focus:ring focus:ring-gray-300 dark:focus:ring-gray-500 disabled:opacity-25 transition ease-in-out duration-150"
                                >
                                    Log in
                                </Link>

                                {Route.has('register') && (
                                    <Link
                                        href={route('register')}
                                        className="ml-4 inline-flex items-center px-4 py-2 bg-gray-800 dark:bg-white border border-transparent rounded-md font-semibold text-xs text-white dark:text-gray-800 uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-gray-200 active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:border-gray-900 dark:focus:border-white focus:ring focus:ring-gray-300 dark:focus:ring-gray-500 disabled:opacity-25 transition ease-in-out duration-150"
                                    >
                                        Register
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
