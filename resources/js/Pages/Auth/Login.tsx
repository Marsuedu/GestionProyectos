import { Head, Link, useForm } from "@inertiajs/react";
import { useEffect } from "react";
// Eliminamos 'import type React' para evitar conflictos, no es estrictamente necesario en JSX moderno

export default function Login() { // Renombrado a Login para coincidir con el archivo
    const loginForm = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const registerForm = useForm({
        name: "",
        surname: "",
        email: "",
        email_confirmation: "",
        password: "",
        password_confirmation: "",
    });

    const submitLogin = (e: any) => { // Usamos any o React.FormEvent si prefieres
        e.preventDefault();
        
        // FUERZA MODO CLARO AL ENTRAR
        localStorage.setItem('theme', 'light');
        document.documentElement.classList.remove('dark');

        loginForm.post(route("login"));
    };

    const submitRegister = (e: any) => {
        e.preventDefault();
        
        // FUERZA MODO CLARO AL REGISTRARSE
        localStorage.setItem('theme', 'light');
        document.documentElement.classList.remove('dark');

        console.log('submitRegister llamado', { registerForm, data: registerForm?.data });
        
        // Verificación de seguridad
        if (!registerForm) {
            console.error('registerForm es undefined');
            alert('Error: El formulario no está inicializado correctamente');
            return;
        }

        // Transformar datos primero
        const transformedData = {
            ...registerForm.data,
            name: `${registerForm.data.name} ${registerForm.data.surname}`,
        };
        
        console.log('Datos transformados:', transformedData);

        // Enviar con los datos transformados
        registerForm.post(route("register"), {
            data: transformedData,
            onError: (errors: Record<string, string[]>) => {
                // Mostrar errores de forma más amigable
                const errorMessages = Object.values(errors).flat();
                const errorMessage = errorMessages.join('\n');
                alert("Error de registro:\n" + errorMessage);
            },
            onFinish: () => registerForm.reset("password", "password_confirmation"),
        });
    };

    useEffect(() => {
        // Limpieza de clases del modo oscuro
        document.documentElement.classList.remove('dark');
        const siteRoot = document.getElementById('site-root');
        const authRoot = document.getElementById('auth-root');
        if (siteRoot) siteRoot.classList.add('bg-[#e9ebee]');
        if (authRoot) authRoot.classList.add('bg-[#e9ebee]');
    }, []);

    return (
        <div className="min-h-screen bg-[#e9ebee] font-sans">
            <Head title="Inicio" />

            {/* ====================== HEADER ====================== */}
            <header className="w-full bg-[#3b5998] py-3 px-6 flex flex-wrap justify-between items-center text-white shadow-md">
                {/* LOGO */}
                <h1 className="text-3xl font-bold tracking-wide">
                    Gestión de Proyectos
                </h1>

                {/* LOGIN AREA */}
                <form onSubmit={submitLogin} className="flex flex-wrap items-end gap-4 text-sm mt-2 md:mt-0">
                    {/* EMAIL */}
                    <div className="flex flex-col">
                        <label className="text-xs mb-1 text-gray-200">Correo</label>
                        <input
                            type="email"
                            className="px-2 py-1 text-black rounded-sm border border-gray-400 focus:ring-1 focus:ring-blue-200 outline-none"
                            value={loginForm.data.email}
                            onChange={(e) => loginForm.setData("email", e.target.value)}
                            required
                        />
                        <label className="flex items-center gap-1 mt-1 text-xs text-gray-300 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={loginForm.data.remember}
                                onChange={(e) => loginForm.setData("remember", e.target.checked)}
                            />
                            No cerrar sesión
                        </label>
                    </div>

                    {/* PASSWORD */}
                    <div className="flex flex-col">
                        <label className="text-xs mb-1 text-gray-200">Contraseña</label>
                        <input
                            type="password"
                            className="px-2 py-1 text-black rounded-sm border border-gray-400 focus:ring-1 focus:ring-blue-200 outline-none"
                            value={loginForm.data.password}
                            onChange={(e) => loginForm.setData("password", e.target.value)}
                            required
                        />
                        <Link
                            href={route("password.request")}
                            className="text-xs text-blue-200 hover:underline mt-1"
                        >
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>

                    {/* LOGIN BUTTON */}
                    <button
                        type="submit"
                        disabled={loginForm.processing}
                        className={`px-4 py-1.5 rounded-sm border font-bold transition mb-5
                            ${loginForm.processing
                                ? 'bg-gray-400 border-gray-400 cursor-not-allowed text-gray-200'
                                : 'bg-[#4267b2] border-[#29487d] hover:bg-[#365899] text-white'
                            }
                        `}
                    >
                        {loginForm.processing ? 'Ingresando...' : 'Ingresar'}
                    </button>
                </form>
            </header>

            {/* ====================== MAIN ====================== */}
            <main
                className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 px-6 py-14"
            >
                {/* LEFT SIDE (Marketing / Features) */}
                <section className="flex flex-col justify-center">
                    <h2 className="text-3xl font-bold mb-6 text-gray-800 leading-tight">
                        Gestiona tus proyectos desde cualquier lugar
                    </h2>

                    <p className="text-lg text-gray-600 mb-8">
                        GestionProyectos te ayuda a organizar tus tareas, supervisar avances
                        y coordinar equipos de manera eficiente.
                    </p>

                    <div className="space-y-4">
                        {[
                            "Asignación de usuarios a proyectos",
                            "Subida de archivos en tareas y proyectos",
                            "Seguimiento del estado de cada tarea",
                            "Panel de administración para roles avanzados"
                        ].map((item, index) => (
                            <div key={index} className="flex items-center gap-3 text-gray-700 font-medium">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                {item}
                            </div>
                        ))}
                    </div>
                </section>

                {/* RIGHT SIDE — SIGN UP FORM */}
                <section>
                    <div className="bg-white shadow-lg rounded-lg p-8 border border-gray-200">
                        <h2 className="text-4xl font-bold mb-2 text-gray-800">
                            Registrarse
                        </h2>
                        <p className="text-lg text-gray-600 mb-6">Es rápido y fácil.</p>

                        <form onSubmit={submitRegister} className="space-y-4">
                            {/* NAME + SURNAME */}
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    placeholder="Nombre"
                                    className="px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-200 outline-none text-black"
                                    value={registerForm.data.name}
                                    onChange={(e) =>
                                        registerForm.setData("name", e.target.value)
                                    }
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Apellidos"
                                    className="px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-200 outline-none text-black"
                                    value={registerForm.data.surname}
                                    onChange={(e) =>
                                        registerForm.setData("surname", e.target.value)
                                    }
                                    required
                                />
                            </div>

                            {/* EMAIL */}
                            <input
                                type="email"
                                placeholder="Correo electrónico"
                                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 outline-none text-black"
                                value={registerForm.data.email}
                                onChange={(e) =>
                                    registerForm.setData("email", e.target.value)
                                }
                                required
                            />

                            {/* EMAIL CONFIRMATION */}
                            <input
                                type="email"
                                placeholder="Confirmar correo electrónico"
                                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 outline-none text-black"
                                value={registerForm.data.email_confirmation}
                                onChange={(e) =>
                                    registerForm.setData("email_confirmation", e.target.value)
                                }
                                required
                            />

                            {/* PASSWORD */}
                            <input
                                type="password"
                                placeholder="Contraseña nueva"
                                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 outline-none text-black"
                                value={registerForm.data.password}
                                onChange={(e) =>
                                    registerForm.setData("password", e.target.value)
                                }
                                required
                            />

                            {/* PASSWORD CONFIRM */}
                            <input
                                type="password"
                                placeholder="Confirmar contraseña"
                                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 outline-none text-black"
                                value={registerForm.data.password_confirmation}
                                onChange={(e) =>
                                    registerForm.setData("password_confirmation", e.target.value)
                                }
                                required
                            />

                            <p className="text-xs text-gray-500 mt-2">
                                Al hacer clic en Registrarte, aceptas nuestras Condiciones, la Política de datos y la Política de cookies.
                            </p>

                            {/* SUBMIT BUTTON */}
                            <div className="flex justify-center mt-4">
                                <button
                                    type="submit"
                                    disabled={registerForm.processing}
                                    className={`w-2/3 font-bold text-lg py-2 rounded-md shadow transition transform hover:scale-105
                                        ${registerForm.processing
                                            ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                                            : 'bg-[#00a400] text-white hover:bg-[#008f00]'
                                        }
                                    `}
                                >
                                    {registerForm.processing ? 'Registrando...' : 'Registrarse'}
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            </main>
        </div>
    );
}