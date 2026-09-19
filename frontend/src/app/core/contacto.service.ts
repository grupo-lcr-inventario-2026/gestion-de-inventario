import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from './api';
import { Contacto } from './models/contacto.model';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {

  private url = `${API_URL}/contactos`;

  constructor(private http: HttpClient) {}

  enviar(contacto: Omit<Contacto, 'id'>): Observable<Contacto> {
    return this.http.post<Contacto>(this.url, contacto);
  }
}