import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Responsavel } from '../models/responsavel';
import { ICrudService } from './i-crud-service';
import { environment } from '../../environments/environment';
import { Pagamento } from '../models/pagamento';
import { ResponsavelResponseDTO } from '../models/responsavel-response.dto.ts';
import { ResponsavelDTO } from '../models/responsaveldto';

@Injectable({
  providedIn: 'root'
})
export class ResponsavelService implements ICrudService<Responsavel> {
  public apiUrl = `${environment.API_URL}/api/responsaveis`;
  private pagamentoApiUrl = `${environment.API_URL}/api/pagamentos`;

  constructor(private http: HttpClient) { }

  get(): Observable<Responsavel[]> {
    return this.http.get<Responsavel[]>(this.apiUrl);
  }
  getByNome(nome: string): Observable<Responsavel[]> {
    return this.http.get<Responsavel[]>(`${this.apiUrl}?nome=${nome}`);
  }
  getComStatusPagamento(): Observable<ResponsavelDTO[]> {
    return this.http.get<ResponsavelDTO[]>(`${this.apiUrl}/clientes`);
  }

  getById(id: number): Observable<Responsavel> {
    return this.http.get<Responsavel>(`${this.apiUrl}/${id}`);
  }

  save(objeto: Responsavel): Observable<Responsavel> {
    if (objeto.id) {
      return this.http.put<Responsavel>(`${this.apiUrl}/${objeto.id}`, objeto);
    } else {
      return this.http.post<Responsavel>(this.apiUrl, objeto);
    }
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  getByUsuarioId(usuarioId: number): Observable<Responsavel> {
    return this.http.get<Responsavel>(`${this.apiUrl}/por-usuario/${usuarioId}`);
  }

  // NOVO MÉTODO: Para obter o pagamento do responsável.
  getPagamentoDoResponsavel(atendimentoId: number): Observable<Pagamento> {
    return this.http.get<Pagamento>(`${this.pagamentoApiUrl}/atendimento/${atendimentoId}`);
  }
}