import { Injectable, signal } from '@angular/core';
import { Rol, Usuario } from '../models/usuario.model';

const SESSION_KEY = 'lcr-inventario:sesion';

/**
 * Contrato mínimo para que el layout de dashboard, la navbar y el auth.guard
 * puedan compilar y navegar. La lógica real (usuarios seed, login, registro
 * y persistencia) la completa Mati en core/auth/auth.service.ts.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly usuarioActual = signal<Usuario | null>(this.leerSesion());

  readonly usuario = this.usuarioActual.asReadonly();

  estaAutenticado(): boolean {
    return this.usuarioActual() !== null;
  }

  rolActual(): Rol | null {
    return this.usuarioActual()?.rol ?? null;
  }

  // TODO(Mati): reemplazar por validación real contra usuarios seed.
  login(_email: string, _password: string): boolean {
    throw new Error('AuthService.login: pendiente de implementación (Mati).');
  }

  // TODO(Mati): reemplazar por alta real de usuario (rol por defecto 'user').
  registrar(_datos: Omit<Usuario, 'id' | 'rol'> & { password: string }): boolean {
    throw new Error('AuthService.registrar: pendiente de implementación (Mati).');
  }

  logout(): void {
    this.usuarioActual.set(null);
    localStorage.removeItem(SESSION_KEY);
  }

  private leerSesion(): Usuario | null {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Usuario) : null;
  }
}
