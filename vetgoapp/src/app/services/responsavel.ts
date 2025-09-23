import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Responsavel } from '../models/responsavel';
import { ICrudService } from './i-crud-service';
import { environment } from '../../environments/environment';
import { ResponsavelResponseDTO } from '../models/responsavel-response.dto';

@Injectable({
  providedIn: 'root'
})
export class ResponsavelService implements ICrudService<Responsavel> {
  public apiUrl = `${environment.API_URL}/responsaveis`;

  constructor(private http: HttpClient) { }

  get(): Observable<Responsavel[]> {
    return this.http.get<Responsavel[]>(this.apiUrl);
  }

  getComStatusPagamento(): Observable<ResponsavelResponseDTO[]> {
    return this.http.get<ResponsavelResponseDTO[]>(`${this.apiUrl}/com-status-pagamento`);
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
}