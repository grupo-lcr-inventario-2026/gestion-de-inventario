import { Injectable } from '@angular/core';
import { Rol, Usuario } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private usuarios: Usuario[] = [
    { id: 1, nombre: 'Ana', apellido: 'Admin', email: 'admin@lcr.com', password: 'admin123', rol: 'admin' },
    { id: 2, nombre: 'Uriel', apellido: 'User', email: 'user@lcr.com', password: 'user123', rol: 'user' },
  ];

  private usuarioActual: Usuario | null = null;

  constructor() {
    const guardado = localStorage.getItem('usuarioActual');
    if (guardado) {
      this.usuarioActual = JSON.parse(guardado);
    }
  }

  login(email: string, password: string): boolean {
    const encontrado = this.usuarios.find(u => u.email === email && u.password === password);

    if (!encontrado) {
      return false;
    }

    this.usuarioActual = encontrado;
    localStorage.setItem('usuarioActual', JSON.stringify(encontrado));
    return true;
  }

  registrar(nombre: string, apellido: string, email: string, password: string): boolean {
    const existe = this.usuarios.find(u => u.email === email);

    if (existe) {
      return false;
    }

    const nuevoUsuario: Usuario = {
      id: this.usuarios.length + 1,
      nombre: nombre,
      apellido: apellido,
      email: email,
      password: password,
      rol: 'user',
    };

    this.usuarios.push(nuevoUsuario);
    return true;
  }

  logout(): void {
    this.usuarioActual = null;
    localStorage.removeItem('usuarioActual');
  }

  estaAutenticado(): boolean {
    return this.usuarioActual !== null;
  }

  rolActual(): Rol | null {
    return this.usuarioActual ? this.usuarioActual.rol : null;
  }

  usuario(): Usuario | null {
    return this.usuarioActual;
  }
}
