import { Injectable } from '@angular/core';
import { Observable, map, of, catchError } from 'rxjs';
import { Rol, Usuario } from '../models/usuario.model';
import { UsuarioService } from '../usuario.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private usuarioActual: Usuario | null = null;

  constructor(private usuarioService: UsuarioService) {
    const guardado = localStorage.getItem('usuarioActual');

    if (guardado) {
      this.usuarioActual = JSON.parse(guardado);
    }
  }

  login(email: string, password: string): Observable<boolean> {
    // El backend valida las credenciales y devuelve el usuario (o error 401).
    return this.usuarioService.login(email, password).pipe(
      map(usuario => {
        this.usuarioActual = usuario;

        localStorage.setItem(
          'usuarioActual',
          JSON.stringify(usuario)
        );

        return true;
      }),
      // Si las credenciales son incorrectas, devolvemos false en vez de error.
      catchError(() => of(false))
    );
  }

  logout(): void {
    this.usuarioActual = null;
    localStorage.removeItem('usuarioActual');
  }

  estaAutenticado(): boolean {
    return this.usuarioActual !== null;
  }

  rolActual(): Rol | null {
    return this.usuarioActual
      ? this.usuarioActual.rol
      : null;
  }

  usuario(): Usuario | null {
    return this.usuarioActual;
  }
}