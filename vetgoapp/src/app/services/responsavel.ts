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

  get(termoBusca?: string): Observable<Responsavel[]> {
    return this.http.get<Responsavel[]>(this.apiUrl);
  }

  getById(id: number): Observable<Responsavel> {
    return this.http.get<Responsavel>(`${this.apiUrl}/${id}`);
  }

  // NOVO MÉTODO: Obtém o Responsavel a partir do ID do Usuario
  getByUsuarioId(usuarioId: number): Observable<Responsavel> {
    return this.http.get<Responsavel>(`${this.apiUrl}/por-usuario/${usuarioId}`);
  }

  save(objeto: Responsavel): Observable<Responsavel> {
    if (objeto.id) {
      return this.http.put<Responsavel>(`${this.apiUrl}/${objeto.id}`, objeto);
    } else {
      return this.http.post<Responsavel>(this.apiUrl, objeto);
    }
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}