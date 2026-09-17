import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from './models/categoria.model';
import { API_URL } from './api';

// Acceso a la coleccion /categorias de json-server.
@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private url = `${API_URL}/categorias`;

  constructor(private http: HttpClient) {}

  obtenerTodas(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.url);
  }

  // Crea una categoria. No se envia el id: lo genera json-server.
  agregar(categoria: Omit<Categoria, 'id'>): Observable<Categoria> {
    return this.http.post<Categoria>(this.url, categoria);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
