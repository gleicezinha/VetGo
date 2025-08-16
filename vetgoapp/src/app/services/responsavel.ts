import { Injectable } from '@angular/core';
import { ICrudService } from './i-crud-service';
import { Responsavel } from '../models/responsavel';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResponsavelService implements ICrudService<Responsavel> {
  public apiUrl: string = environment.API_URL + '/api/responsaveis';

  constructor(private http: HttpClient) { }

  // GET: /api/responsaveis
  get(termoBusca?: string): Observable<Responsavel[]> {
    // A busca pode ser implementada no back-end com @RequestParam
    // Por enquanto, este endpoint busca todos os responsáveis.
    return this.http.get<Responsavel[]>(this.apiUrl);
  }

  // GET: /api/responsaveis/{id}
  getById(id: number): Observable<Responsavel> {
    return this.http.get<Responsavel>(`${this.apiUrl}/${id}`);
  }

  // POST: /api/responsaveis  ou  PUT: /api/responsaveis/{id}
  save(objeto: Responsavel): Observable<Responsavel> {
    if (objeto.id) {
      // Atualiza um responsável existente
      return this.http.put<Responsavel>(`${this.apiUrl}/${objeto.id}`, objeto);
    } else {
      // Cria um novo responsável
      return this.http.post<Responsavel>(this.apiUrl, objeto);
    }
  }

  // DELETE: /api/responsaveis/{id}
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}