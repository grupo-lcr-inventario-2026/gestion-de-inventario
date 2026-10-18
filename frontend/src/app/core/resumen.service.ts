import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Resumen {
  productosPreparados: number;
  productosPendientes: number;
  empleadosActivos: number;
}

@Injectable({ providedIn: 'root' })
export class ResumenService {
  private apiUrl = 'http://localhost:8000/api/v1/resumen';

  constructor(private http: HttpClient) {}

  obtener(): Observable<Resumen> {
    return this.http.get<Resumen>(this.apiUrl);
  }
}