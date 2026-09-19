import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Usuario } from './models/usuario.model';
import { API_URL } from './api';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private url = `${API_URL}/usuarios`;

  constructor(private http: HttpClient) {}

  obtenerTodos(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.url);
  }

  agregar(usuario: Omit<Usuario, 'id'>): Observable<Usuario> {
    return this.http.post<Usuario>(this.url, usuario);
  }

  editar(id: number, usuario: Omit<Usuario, 'id'>): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.url}/${id}`, usuario);
  }

  actualizarEstado(id: number, activo: boolean): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.url}/${id}`, { activo });
  }
}