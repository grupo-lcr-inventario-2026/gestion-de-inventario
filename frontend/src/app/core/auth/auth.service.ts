import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
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
    return this.usuarioService.obtenerTodos().pipe(
      map(usuarios => {
        const encontrado = usuarios.find(
          usuario =>
            usuario.email === email &&
            usuario.password === password &&
            usuario.activo
        );

        if (!encontrado) {
          return false;
        }

        this.usuarioActual = encontrado;

        localStorage.setItem(
          'usuarioActual',
          JSON.stringify(encontrado)
        );

        return true;
      })
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