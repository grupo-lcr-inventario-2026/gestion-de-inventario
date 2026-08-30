# Frontend - SPA Angular (Evidencia de Aprendizaje 4)

SPA en Angular que evoluciona la maqueta estática de `../maqueta/` (Evidencia 3) a una
aplicación de página única, con ruteo, formularios reactivos y datos simulados (no hay
backend todavía).

## Requisitos

- Node.js **24.19.0**
- Angular CLI **22.1.3** (`npm install -g @angular/cli@22.1.3`)

## Instalación y ejecución local

```bash
cd frontend
npm install
ng serve
```

Abrir `http://localhost:4200/`. La app recarga sola al guardar cambios.

## Usuarios de prueba

> Pendiente: `core/auth/auth.service.ts` todavía no tiene los usuarios simulados
> (login/registro reales) — se completa en `feat/angular-auth`. Una vez cargados,
> documentar acá el email/contraseña de un usuario `admin` y uno `user` para probar
> ambos roles.

## Estructura de carpetas

```
src/app/
  core/
    auth/         AuthService (sesión + rol) y authGuard
    models/       interfaces compartidas (Usuario, Producto, etc.)
  layout/
    public-layout/     navbar pública + footer (rutas públicas)
    dashboard-layout/  navbar de dashboard (rol visible) + footer (rutas protegidas)
  shared/
    navbar-publica/, navbar-dashboard/, footer/
  pages/
    home/, quienes-somos/, login/, registro/, recuperar-password/
    dashboard/productos/, dashboard/stock/, dashboard/reportes/
    not-found/
  app.routes.ts   árbol de rutas (públicas, /dashboard protegido, 404)
```

## Rutas

| Ruta | Acceso | Componente |
|---|---|---|
| `/` | Público | Home |
| `/quienes-somos` | Público | QuienesSomos |
| `/login` | Público | Login |
| `/registro` | Público | Registro |
| `/recuperar-password` | Público | RecuperarPassword |
| `/dashboard/productos` | Autenticado (Admin: CRUD / User: solo lectura) | Productos |
| `/dashboard/stock` | Autenticado (Admin: edita / User: solo lectura) | Stock |
| `/dashboard/reportes` | Autenticado (ambos roles, solo lectura) | Reportes |
| `**` | — | NotFound (404) |

## Build

```bash
ng build
```

Genera los artefactos de producción en `dist/frontend`.
