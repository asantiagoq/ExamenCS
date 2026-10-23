import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  PersonaNaturalListado, 
  PersonaNaturalRegistro, 
  PersonaNaturalDetalle 
} from '../models/persona-natural';

@Injectable({
  providedIn: 'root'
})
export class PersonaNaturalService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:5197/api/PersonasNaturales';

  listar(): Observable<PersonaNaturalListado[]> {
    return this.http.get<PersonaNaturalListado[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<PersonaNaturalDetalle> {
    return this.http.get<PersonaNaturalDetalle>(`${this.apiUrl}/${id}`);
  }

  crear(persona: PersonaNaturalRegistro): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(this.apiUrl, persona);
  }

  actualizar(id: number, persona: PersonaNaturalRegistro): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, persona);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}