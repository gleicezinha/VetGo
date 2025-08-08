import { Injectable } from '@angular/core';
import { ICrudService } from './i-crud-service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Atendimento } from '../models/atendimento';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AtendimentoService implements ICrudService<Atendimento> {
constructor(private http: HttpClient) {}

  apiUrl: string = environment.API_URL + '/atendimento';

  get(termoBusca?: string): Observable<Atendimento[]> {
    let url = this.apiUrl + '/consultar-todos';
    if (termoBusca) {
      url += '?termoBusca=' + termoBusca;
    }
    return this.http.get<Atendimento[]>(url);
  }
  getById(id: number): Observable<Atendimento> {
    return this.http.get<Atendimento>(`${this.apiUrl}/${id}`);
  }
  getByPacienteId(id: number): Observable<Atendimento[]> {
    return this.http.get<Atendimento[]>(`${this.apiUrl}?pacienteId=${id}`);
  }
  getByResponsavelId(id: number): Observable<Atendimento[]> {
    return this.http.get<Atendimento[]>(`${this.apiUrl}?responsavelId=${id}`);
  }
  getByProfissionalId(id: number): Observable<Atendimento[]> {
    return this.http.get<Atendimento[]>(`${this.apiUrl}?profissionalId=${id}`);
  }
  getByTipoDeAtendimentoId(id: number): Observable<Atendimento[]> {
    return this.http.get<Atendimento[]>(`${this.apiUrl}?tipoDeAtendimentoId=${id}`);
  }
  save(objeto: Atendimento): Observable<Atendimento> {
    let url = this.apiUrl;
    if (objeto.id) {
      url += '/atualizar';
      return this.http.put<Atendimento>(url, objeto);
    } else {
      url += '/inserir';
      return this.http.post<Atendimento>(url, objeto);
    }
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remover/${id}`);
  }

  atualizarStatus(id: number): Observable<Atendimento> {
    let url = this.apiUrl + '/status/' + id
    return this.http.put<Atendimento>(url, null);
  }
}
