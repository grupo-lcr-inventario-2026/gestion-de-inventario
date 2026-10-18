
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Movimiento, TipoMovimiento } from './models/movimiento.model';
import { API_URL } from './api';

@Injectable({
  providedIn: 'root'
})
export class MovimientoService {
  private url = `${API_URL}/movimientos`;

  constructor(private http: HttpClient) {}

  obtenerTodos(): Observable<Movimiento[]> {
    return this.http.get<Movimiento[]>(this.url);
  }

  confirmar(datos: {
    productoId: number;
    tipo: TipoMovimiento;
    usuarioId: number;
  }): Observable<Movimiento> {
    return this.http.post<Movimiento>(
      `${this.url}/confirmar`,
      datos
    );
  }
}
