import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movimiento } from './models/movimiento.model';
import { API_URL } from './api';

// Acceso a la coleccion /movimientos (ingresos y preparaciones confirmados).
@Injectable({ providedIn: 'root' })
export class MovimientoService {
  private url = `${API_URL}/movimientos`;

  constructor(private http: HttpClient) {}

  obtenerTodos(): Observable<Movimiento[]> {
    return this.http.get<Movimiento[]>(this.url);
  }

  // Registra un movimiento nuevo. El id lo genera json-server.
  registrar(movimiento: Omit<Movimiento, 'id'>): Observable<Movimiento> {
    return this.http.post<Movimiento>(this.url, movimiento);
  }
}
