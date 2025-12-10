<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link
        href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap"
        rel="stylesheet"
    />

    <!-- Scripts -->
    @routes
    @viteReactRefresh
    {{-- Carga el entrypoint React/TypeScript; el CSS se importa dentro de app.tsx --}}
    @vite(['resources/js/app.tsx'])
    @inertiaHead
</head>

<body class="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 antialiased">
    <div id="site-root" class="min-h-screen">
        @inertia
    </div>
</body>
</html>
