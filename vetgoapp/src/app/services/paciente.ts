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

  // GET: /api/pacientes
  get(termoBusca?: string): Observable<Paciente[]> {
    let params = new HttpParams();
    if (termoBusca) {
      params = params.set('termo', termoBusca); // O back-end pode usar @RequestParam("termo")
    }
    return this.http.get<Paciente[]>(this.apiUrl, { params });
  }

  // GET: /api/pacientes/{id}
  getById(id: number): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.apiUrl}/${id}`);
  }

  // GET: /api/pacientes/por-tutor/{responsavelId}
  getByResponsavelId(responsavelId: number): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${this.apiUrl}/por-tutor/${responsavelId}`);
  }

  // POST: /api/pacientes  ou  PUT: /api/pacientes/{id}
  save(objeto: Paciente): Observable<Paciente> {
    if (objeto.id) {
      return this.http.put<Paciente>(`${this.apiUrl}/${objeto.id}`, objeto);
    } else {
      // Para criar um paciente, precisamos do ID do responsável.
      // O componente que chama este método deve garantir que objeto.responsavel.id exista.
      if (!objeto.responsavel?.id) {
        throw new Error('O ID do responsável é obrigatório para criar um novo paciente.');
      }
      // O back-end espera o ID como @RequestParam, então o enviamos separadamente.
      const params = new HttpParams().set('idResponsavel', objeto.responsavel.id.toString());
      return this.http.post<Paciente>(this.apiUrl, objeto, { params });
    }
  }

  // DELETE: /api/pacientes/{id}
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}