import {  Injectable } from '@angular/core';
import { ICrudService } from './i-crud-service';
import { Paciente } from '../models/paciente';
import { HttpClient } from '@angular/common/http';
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
  
  get(termoBusca?: string): Observable<Paciente[]>{
    let url = this.apiUrl + '/consultar-todos';
    if(termoBusca){
      url += '?termoBusca=' + termoBusca;
    }
    return this.http.get<Paciente[]>(url);
  }

  getById(id: number): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.apiUrl}/${id}`);
  }

  getByResponsavelId(responsavelId: number): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${this.apiUrl}?responsavelId=${responsavelId}`);
  }

  save(objeto: Paciente): Observable<Paciente> {
    let url = this.apiUrl;
    if (objeto.id) {
      url += '/atualizar';
      return this.http.put<Paciente>(url, objeto);
    }
    else {
      url += '/inserir';
      return this.http.post<Paciente>(url, objeto);
    }
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remover/${id}`);
  }
}
