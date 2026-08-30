import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Registro } from './pages/registro/registro';
import { Login } from './pages/login/login';
import { RecuperarPassword } from './pages/recuperar-password/recuperar-password';
import { QuienesSomos } from './pages/quienes-somos/quienes-somos';
import { authGuard } from './core/guards/auth-guard';
import { DashboardLayout } from './dashboard/dashboard-layout/dashboard-layout';
import { Productos } from './dashboard/productos/productos';
import { Reportes } from './dashboard/reportes/reportes';
import { Stock } from './dashboard/stock/stock';
import { NotFound } from './pages/not-found/not-found';

export const routes: Routes = [

//Rutas públicas   
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
  { path: 'recuperar-password', component: RecuperarPassword },
  { path: 'quienes-somos', component: QuienesSomos },


//Rutas del Dashboard (Protegidas)
  {path: 'dashboard',
    component: DashboardLayout,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'productos', pathMatch: 'full' },
      { path: 'productos', component: Productos },
      { path: 'stock', component: Stock },
      { path: 'reportes', component: Reportes },
    ]
  },

//Página 404
  { path: '**', component: NotFound },
]