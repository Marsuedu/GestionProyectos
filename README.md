# Sistema de Administración de Proyectos

Un sistema completo de gestión de proyectos desarrollado con Laravel, React + TypeScript e Inertia.js.

## Características

- **Gestión de Usuarios**: Registro, autenticación y manejo de roles (Administrador, Responsable de proyecto, Responsable de tarea)
- **Gestión de Proyectos**: Creación, edición y seguimiento de proyectos con asignación de responsables
- **Gestión de Tareas**: Creación de tareas asociadas a proyectos con seguimiento de estado
- **Subida de Archivos**: Soporte para PDF, DOC/DOCX, JPG en proyectos y tareas
- **Dashboard Interactivo**: Visualización de estadísticas y tareas por proyecto y usuario
- **Logs de Actividad**: Registro automático de acciones del sistema
- **Interfaz Responsiva**: Diseño moderno con TailwindCSS

## Tecnologías

- **Backend**: Laravel 12 con Laravel Breeze
- **Frontend**: React 18 + TypeScript con Inertia.js
- **Base de datos**: MySQL
- **Estilos**: TailwindCSS
- **Autenticación**: Laravel Breeze

## Instalación

### Prerrequisitos

- PHP 8.2+
- Composer
- Node.js 18+
- MySQL 8.0+

### Pasos de instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd proyecto
   ```

2. **Instalar dependencias de PHP**
   ```bash
   composer install
   ```

3. **Instalar dependencias de Node.js**
   ```bash
   npm install
   ```

4. **Configurar el archivo de entorno**
   ```bash
   cp .env.example .env
   ```
   
   Editar `.env` con la configuración de tu base de datos:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=proyecto_db
   DB_USERNAME=tu_usuario
   DB_PASSWORD=tu_contraseña
   ```

5. **Generar clave de aplicación**
   ```bash
   php artisan key:generate
   ```

6. **Ejecutar migraciones y seeders**
   ```bash
   php artisan migrate --seed
   ```

7. **Crear enlace simbólico para storage**
   ```bash
   php artisan storage:link
   ```

8. **Compilar assets**
   ```bash
   npm run build
   ```

## Desarrollo

Para desarrollo local:

```bash
# Terminal 1: Servidor Laravel
php artisan serve

# Terminal 2: Compilación de assets en tiempo real
npm run dev
```

## Usuarios por defecto

Después de ejecutar los seeders, tendrás disponible:

- **Email**: admin@proyecto.com
- **Contraseña**: password123
- **Rol**: Administrador

## Estructura del proyecto

```
├── app/
│   ├── Http/Controllers/     # Controladores
│   ├── Models/              # Modelos Eloquent
│   ├── Policies/            # Políticas de autorización
│   └── Http/Middleware/     # Middleware personalizado
├── database/
│   ├── migrations/          # Migraciones de base de datos
│   └── seeders/            # Seeders
├── resources/
│   ├── js/
│   │   ├── Components/      # Componentes React reutilizables
│   │   ├── Layouts/         # Layouts de la aplicación
│   │   ├── Pages/           # Páginas React
│   │   └── types/           # Tipos TypeScript
│   └── css/                # Estilos CSS
└── routes/
    └── web.php             # Rutas web
```

## Roles y Permisos

### Administrador
- Acceso completo al sistema
- Gestión de usuarios, proyectos y tareas
- Visualización de todos los datos

### Responsable de proyecto
- Creación y gestión de proyectos
- Asignación de usuarios a proyectos
- Creación de tareas en sus proyectos

### Responsable de tarea
- Actualización del estado de tareas asignadas
- Visualización de sus tareas y proyectos

## API Endpoints

### Proyectos
- `GET /projects` - Listar proyectos
- `POST /projects` - Crear proyecto
- `GET /projects/{id}` - Ver proyecto
- `PUT /projects/{id}` - Actualizar proyecto
- `DELETE /projects/{id}` - Eliminar proyecto

### Tareas
- `GET /tasks` - Listar tareas
- `POST /tasks` - Crear tarea
- `GET /tasks/{id}` - Ver tarea
- `PUT /tasks/{id}` - Actualizar tarea
- `PATCH /tasks/{id}/status` - Actualizar estado
- `DELETE /tasks/{id}` - Eliminar tarea

### Archivos
- `POST /files` - Subir archivo
- `GET /files/{id}/download` - Descargar archivo
- `DELETE /files/{id}` - Eliminar archivo

## Despliegue

### Heroku

1. **Crear aplicación**
   ```bash
   heroku create tu-app-name
   ```

2. **Configurar variables de entorno**
   ```bash
   heroku config:set APP_KEY=$(php artisan --show key:generate)
   heroku config:set APP_ENV=production
   heroku config:set APP_DEBUG=false
   ```

3. **Configurar base de datos**
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

4. **Desplegar**
   ```bash
   git push heroku main
   heroku run php artisan migrate --seed
   ```

### AWS/Azure/Vercel

Para otros proveedores de nube, asegúrate de:

1. Configurar las variables de entorno apropiadas
2. Ejecutar `npm run build` para compilar assets
3. Configurar el servidor web para servir `public/index.php`
4. Ejecutar migraciones en el entorno de producción

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.
# GestionProyectos.2
