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
  constructor(
    private http: HttpClient
  ) { }

  apiUrl: string = environment.API_URL + '/pacientes';

  get(termoBusca?: string): Observable<Paciente[]> {
    let params = new HttpParams();
    if (termoBusca) {
      params = params.set('termoBusca', termoBusca);
    }

    return this.http.get<Paciente[]>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.apiUrl}/${id}`);
  }

  getByResponsavelId(responsavelId: number): Observable<Paciente[]> {

    return this.http.get<Paciente[]>(`${this.apiUrl}/responsavel/${responsavelId}`);
  }

  save(objeto: Paciente): Observable<Paciente> {

    if (!objeto.id) {
      return this.http.post<Paciente>(this.apiUrl, objeto);
    }
    else {
      return this.http.put<Paciente>(`${this.apiUrl}/${objeto.id}`, objeto);
    }
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}