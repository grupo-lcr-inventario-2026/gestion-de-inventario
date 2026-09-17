import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

// Deja pasar solo a los administradores.
// Si un empleado intenta entrar a una ruta de admin, lo manda a Productos.
export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.rolActual() === 'admin') {
    return true;
  }

  return router.parseUrl('/dashboard/productos');
};
