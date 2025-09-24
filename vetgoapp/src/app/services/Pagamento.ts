import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Pagamento } from '../models/pagamento';
import { PagamentoRequestDTO } from '../models/pagamento-request-dto';

@Injectable({
  providedIn: 'root'
})
export class PagamentoService {
  private apiUrl = `${environment.API_URL}/api/pagamentos`;

  constructor(private http: HttpClient) { }

  // Método para salvar um novo pagamento
  save(pagamento: PagamentoRequestDTO): Observable<Pagamento> {
    return this.http.post<Pagamento>(this.apiUrl, pagamento);
  }

  // Método para buscar um pagamento pelo ID do atendimento
  getByAtendimentoId(atendimentoId: number): Observable<Pagamento> {
    return this.http.get<Pagamento>(`${this.apiUrl}/atendimento/${atendimentoId}`);
  }
}