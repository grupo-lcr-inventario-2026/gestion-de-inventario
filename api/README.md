# Backend API — Django REST Framework

API REST del sistema de gestión de depósito TP3D. Reemplaza al json-server de la Evidencia 5.
Base de datos: **MySQL**. Corre en `http://localhost:8000` y el frontend Angular lo consume desde `http://localhost:4200`.

## Requisitos

- Python 3.11 o superior (probado con 3.13).
- MySQL 8.x corriendo en `localhost:3306`.

## Puesta en marcha (primera vez)

### 1. Crear la base de datos
Abrir `scripts/crear_base_datos.sql` en MySQL Workbench (o la consola de MySQL) y ejecutarlo
con un usuario administrador (ej. `root`). Crea la base `tp3d_inventario` y el usuario `tp3d_user`.

### 2. Preparar el entorno de Python
Desde la carpeta `api/`:

```bash
python -m venv venv
venv\Scripts\activate            # En Windows (en Git Bash: source venv/Scripts/activate)
pip install -r requirements.txt
```

### 3. Crear las tablas y cargar datos iniciales

```bash
python manage.py migrate
python manage.py loaddata usuarios_iniciales
```

### 4. Levantar el servidor

```bash
python manage.py runserver
```

Queda en `http://localhost:8000`. Probar en el navegador: `http://localhost:8000/api/v1/usuarios`.

## Datos de acceso

| Rol      | Email               | Contraseña    |
|----------|---------------------|---------------|
| Admin    | `admin@tp3d.com`    | `admin123`    |
| Empleado | `empleado@tp3d.com` | `empleado123` |

Configuración de la base (en `config/settings.py`): base `tp3d_inventario`, usuario `tp3d_user`.

## Endpoints

Todos bajo el prefijo `/api/v1/` y **sin barra final**.

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/v1/login` | Valida email + contraseña, devuelve el usuario |
| GET | `/api/v1/usuarios` | Lista usuarios (acepta `?email=`) |
| POST | `/api/v1/usuarios` | Crea un usuario |
| GET/PUT/PATCH/DELETE | `/api/v1/usuarios/<id>` | Ver, reemplazar, modificar o borrar |

Las apps `productos`, `movimientos` y `contactos` agregan sus endpoints siguiendo el mismo patrón
(un serializer + vistas que heredan de `APIView`, una para la lista y otra para el detalle).

## Convenciones para el equipo

- Cada app agrega su nombre a `INSTALLED_APPS` (en `config/settings.py`) y su `include(...)`
  en `config/urls.py` bajo `api/v1/`.
- Rutas sin barra final.
- Los campos que viajan al frontend van en **camelCase** (`productoId`, `usuarioId`, `cantidadPendiente`).
- Las vistas devuelven el código HTTP correcto (200, 201, 400, 401, 404).
- Los datos iniciales de cada app van en `<app>/fixtures/<app>_iniciales.json`.
- No subir la carpeta `venv/` (está en el `.gitignore`).
