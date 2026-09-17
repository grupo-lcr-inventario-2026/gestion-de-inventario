import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from './models/producto.model';
import { API_URL } from './api';

// Unico punto de acceso a la coleccion /productos de json-server.
// Todos los metodos devuelven un Observable: el componente hace subscribe
// para recibir la respuesta cuando llega.
@Injectable({ providedIn: 'root' })
export class ProductoService {
  private url = `${API_URL}/productos`;

  constructor(private http: HttpClient) {}

  obtenerTodos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.url);
  }

  obtenerPorId(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.url}/${id}`);
  }

  // Crea un producto. No se envia el id: lo genera json-server.
  agregar(producto: Omit<Producto, 'id'>): Observable<Producto> {
    return this.http.post<Producto>(this.url, producto);
  }

  // Reemplaza el producto completo.
  editar(id: number, producto: Omit<Producto, 'id'>): Observable<Producto> {
    return this.http.put<Producto>(`${this.url}/${id}`, producto);
  }

  // Cambia solo los campos indicados (por ejemplo stock, estado, cantidadPendiente).
  actualizarParcial(id: number, cambios: Partial<Producto>): Observable<Producto> {
    return this.http.patch<Producto>(`${this.url}/${id}`, cambios);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
