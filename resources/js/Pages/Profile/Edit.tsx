import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';

export default function Edit({ mustVerifyEmail, status }: PageProps<{ mustVerifyEmail: boolean, status?: string }>) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Perfil
                </h2>
            }
        >
            <Head title="Perfil" />

            <div className="py-12 bg-gray-100 dark:bg-black min-h-screen">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    
                    {/* Tarjeta 1: Info */}
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    {/* Tarjeta 2: Password */}
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    {/* Tarjeta 3: Borrar */}
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}