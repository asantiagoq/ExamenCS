import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  PersonaJuridicaDetalle,
  PersonaJuridicaListado,
  PersonaJuridicaRegistro
} from '../models/persona-juridica';

@Injectable({
  providedIn: 'root'
})
export class PersonaJuridicaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:5197/api/PersonasJuridicas';

  listar(): Observable<PersonaJuridicaListado[]> {
    return this.http.get<PersonaJuridicaListado[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<PersonaJuridicaDetalle> {
    return this.http.get<PersonaJuridicaDetalle>(`${this.apiUrl}/${id}`);
  }

  crear(modelo: PersonaJuridicaRegistro): Observable<{ id: number; mensaje: string }> {
    return this.http.post<{ id: number; mensaje: string }>(this.apiUrl, modelo);
  }

  actualizar(id: number, modelo: PersonaJuridicaRegistro): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(`${this.apiUrl}/${id}`, modelo);
  }

  eliminar(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.apiUrl}/${id}`);
  }
}