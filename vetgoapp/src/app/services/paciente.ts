import { Injectable } from '@angular/core';
import { ICrudService } from './i-crud-service';
import { Paciente } from '../models/paciente';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PacienteService implements ICrudService<Paciente> {
  constructor(private http: HttpClient) { }

  apiUrl: string = environment.API_URL + '/api/pacientes';

  get(termoBusca?: string): Observable<Paciente[]> {
    let params = new HttpParams();
    if (termoBusca) {
      params = params.set('termo', termoBusca);
    }
    return this.http.get<Paciente[]>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.apiUrl}/${id}`);
  }

  getByResponsavelId(responsavelId: number): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${this.apiUrl}/por-tutor/${responsavelId}`);
  }

  save(objeto: Paciente): Observable<Paciente> {
    if (objeto.id) {
      // ⬅️ CORREÇÃO: Altera a URL para corresponder à sua API (PUT /api/pacientes/{id})
      return this.http.put<Paciente>(`${this.apiUrl}/${objeto.id}`, objeto);
    } else {
      if (!objeto.responsavel?.id) {
        throw new Error('O ID do responsável é obrigatório para criar um novo paciente.');
      }
      const params = new HttpParams().set('idResponsavel', objeto.responsavel.id.toString());
      return this.http.post<Paciente>(this.apiUrl, objeto, { params });
    }
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}