import { Injectable } from '@angular/core';
import { ICrudService } from './i-crud-service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Atendimento } from '../models/atendimento';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AtendimentoService { // Não implementa ICrudService pois os métodos são mais específicos
  constructor(private http: HttpClient) {}

  apiUrl: string = environment.API_URL + '/api/atendimentos';

  // GET: /api/atendimentos/{id}
  getById(id: number): Observable<Atendimento> {
    return this.http.get<Atendimento>(`${this.apiUrl}/${id}`);
  }

  // GET: /api/atendimentos/por-paciente/{id} (Exemplo de como seria um endpoint customizado)
  getByPacienteId(id: number): Observable<Atendimento[]> {
    return this.http.get<Atendimento[]>(`${this.apiUrl}/por-paciente/${id}`);
  }

  // POST: /api/atendimentos/agendar?pacienteId=X&profissionalId=Y
  save(objeto: Atendimento): Observable<Atendimento> {
    if (objeto.id) {
        // PUT: /api/atendimentos/{id}
        return this.http.put<Atendimento>(`${this.apiUrl}/${objeto.id}`, objeto);
    } else {
        if (!objeto.paciente?.id || !objeto.profissional?.id) {
            throw new Error('IDs do paciente e do profissional são obrigatórios para agendar.');
        }
        const params = new HttpParams()
            .set('pacienteId', objeto.paciente.id.toString())
            .set('profissionalId', objeto.profissional.id.toString());
            
        return this.http.post<Atendimento>(`${this.apiUrl}/agendar`, objeto, { params });
    }
  }

  // PUT: /api/atendimentos/{id}/cancelar
  cancelar(id: number): Observable<Atendimento> {
    return this.http.put<Atendimento>(`${this.apiUrl}/${id}/cancelar`, {});
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}