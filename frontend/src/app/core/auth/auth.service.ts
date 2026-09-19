import { Injectable } from '@angular/core';
import { Observable, map, of, switchMap } from 'rxjs';
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

  registrar(
    nombre: string,
    apellido: string,
    email: string,
    password: string
  ): Observable<boolean> {
    return this.usuarioService.obtenerTodos().pipe(
      switchMap(usuarios => {
        const existe = usuarios.some(
          usuario => usuario.email === email
        );

        if (existe) {
          return of(false);
        }

        const nuevoUsuario: Omit<Usuario, 'id'> = {
          nombre,
          apellido,
          email,
          password,
          rol: 'empleado',
          activo: true,
        };

        return this.usuarioService.agregar(nuevoUsuario).pipe(
          map(() => true)
        );
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