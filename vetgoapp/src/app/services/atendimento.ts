import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Atendimento } from '../models/atendimento';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AtendimentoService {
  constructor(private http: HttpClient) {}

  apiUrl: string = environment.API_URL + '/api/atendimentos';

  getById(id: number): Observable<Atendimento> {
    return this.http.get<Atendimento>(`${this.apiUrl}/${id}`);
  }

  getByPacienteId(id: number): Observable<Atendimento[]> {
    return this.http.get<Atendimento[]>(`${this.apiUrl}/por-paciente/${id}`);
  }

  // ✅ Agora também envia responsavelId e observacao
  save(objeto: Atendimento): Observable<Atendimento> {
    if (objeto.id) {
      // Lógica para ATUALIZAR um atendimento (se necessário no futuro)
      return this.http.put<Atendimento>(`${this.apiUrl}/${objeto.id}`, objeto);
    } else {
      // Lógica para CRIAR um novo atendimento (agendamento)
      if (!objeto.paciente?.id || !objeto.profissional?.id) {
        throw new Error('IDs do paciente e do profissional são obrigatórios para agendar.');
      }

      const agendamentoRequest = {
        pacienteId: objeto.paciente.id,
        profissionalId: objeto.profissional.id,
        responsavelId: objeto.responsavel?.id,
        dataHoraAtendimento: objeto.dataHoraAtendimento,
        tipoDeAtendimento: objeto.tipoDeAtendimento,
        observacao: objeto.observacao
      };

      // Envia para o endpoint correto: /api/atendimentos/agendar
      return this.http.post<Atendimento>(`${this.apiUrl}/agendar`, agendamentoRequest);
    }
  }

  cancelar(id: number): Observable<Atendimento> {
    return this.http.put<Atendimento>(`${this.apiUrl}/${id}/cancelar`, {});
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
