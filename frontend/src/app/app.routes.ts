import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { adminGuard } from './core/auth/admin.guard';
import { AuthService } from './core/auth/auth.service';
import { PublicLayout } from './layout/public-layout/public-layout';
import { DashboardLayout } from './layout/dashboard-layout/dashboard-layout';
import { Home } from './pages/home/home';
import { QuienesSomos } from './pages/quienes-somos/quienes-somos';
import { Contacto } from './pages/contacto/contacto';
import { Login } from './pages/login/login';
import { RecuperarPassword } from './pages/recuperar-password/recuperar-password';
import { Productos } from './pages/dashboard/productos/productos';
import { PanelTrabajoComponent } from './pages/dashboard/panel-trabajo/panel-trabajo';
import { ResumenComponent } from './pages/dashboard/resumen/resumen';
import { Stock } from './pages/dashboard/stock/stock';
import { Empleados } from './pages/dashboard/empleados/empleados';
import { NotFound } from './pages/not-found/not-found';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayout,
    children: [
      { path: '', component: Home },
      { path: 'quienes-somos', component: QuienesSomos },
      { path: 'contacto', component: Contacto },
      { path: 'login', component: Login },
      { path: 'recuperar-password', component: RecuperarPassword },
    ],
  },
  {
    path: 'dashboard',
    component: DashboardLayout,
    canActivate: [authGuard],
    children: [
      // Pantalla inicial segun el rol: admin -> resumen, empleado -> panel
      {
        path: '',
        pathMatch: 'full',
        redirectTo: () => (inject(AuthService).rolActual() === 'admin' ? 'resumen' : 'panel'),
      },
      // Para ambos roles
      { path: 'productos', component: Productos },
      { path: 'panel', component: PanelTrabajoComponent },
     
      // Solo administrador
      { path: 'resumen', component: ResumenComponent, canActivate: [adminGuard] },
      { path: 'stock', component: Stock, canActivate: [adminGuard] },
      { path: 'empleados', component: Empleados, canActivate: [adminGuard] },
    ],
  },
  // Fuera de ambos layouts a proposito: '**' con pathMatch prefix dentro del
  // grupo '' (PublicLayout) capturaria /dashboard antes de llegar a esa ruta,
  // porque el router prueba los hijos de '' en orden. Se deja como ruta propia.
  { path: '**', component: NotFound },
];
