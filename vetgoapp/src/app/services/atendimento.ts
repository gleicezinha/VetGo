// src/app/services/atendimento.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Atendimento } from '../models/atendimento';
import { Observable } from 'rxjs';
import { AtendimentoResponseDTO } from '../models/atendimento-response.dto';

@Injectable({
  providedIn: 'root'
})
export class AtendimentoService {
  constructor(private http: HttpClient) { }

  apiUrl: string = environment.API_URL + '/api/atendimentos';

  getHorariosOcupados(profissionalId: number, data: string): Observable<string[]> {
    const params = new HttpParams()
      .set('profissionalId', profissionalId.toString())
      .set('data', data);
    return this.http.get<string[]>(`${this.apiUrl}/horarios-ocupados`, { params });
  }

  // APROVAÇÃO: Este método agora busca a entidade completa
  getById(id: number): Observable<Atendimento> {
    return this.http.get<Atendimento>(`${this.apiUrl}/${id}`);
  }

  getAtendimentoById(id: number): Observable<AtendimentoResponseDTO> {
    return this.http.get<AtendimentoResponseDTO>(`${this.apiUrl}/${id}`);
  }

  getAll(): Observable<AtendimentoResponseDTO[]> {
    return this.http.get<AtendimentoResponseDTO[]>(`${this.apiUrl}/todos`);
  }

  getByPacienteId(id: number): Observable<Atendimento[]> {
    return this.http.get<Atendimento[]>(`${this.apiUrl}/por-paciente/${id}`);
  }

  save(objeto: Atendimento): Observable<Atendimento> {
    if (objeto.id) {
      return this.http.put<Atendimento>(`${this.apiUrl}/${objeto.id}`, objeto);
    } else {
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