import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { PublicLayout } from './layout/public-layout/public-layout';
import { DashboardLayout } from './layout/dashboard-layout/dashboard-layout';
import { Home } from './pages/home/home';
import { QuienesSomos } from './pages/quienes-somos/quienes-somos';
import { Login } from './pages/login/login';
import { Registro } from './pages/registro/registro';
import { RecuperarPassword } from './pages/recuperar-password/recuperar-password';
import { Productos } from './pages/dashboard/productos/productos';
import { Stock } from './pages/dashboard/stock/stock';
import { Reportes } from './pages/dashboard/reportes/reportes';
import { NotFound } from './pages/not-found/not-found';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayout,
    children: [
      { path: '', component: Home },
      { path: 'quienes-somos', component: QuienesSomos },
      { path: 'login', component: Login },
      { path: 'registro', component: Registro },
      { path: 'recuperar-password', component: RecuperarPassword },
    ],
  },
  {
    path: 'dashboard',
    component: DashboardLayout,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'productos', pathMatch: 'full' },
      { path: 'productos', component: Productos },
      { path: 'stock', component: Stock },
      { path: 'reportes', component: Reportes },
    ],
  },
  // Fuera de ambos layouts a proposito: '**' con pathMatch prefix dentro del
  // grupo '' (PublicLayout) capturaria /dashboard antes de llegar a esa ruta,
  // porque el router prueba los hijos de '' en orden. Se deja como ruta propia.
  { path: '**', component: NotFound },
];
