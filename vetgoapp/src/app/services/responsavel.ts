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
  public apiUrl: string = environment.API_URL + '/responsaveis';

  constructor(private http: HttpClient) { }

  get(termoBusca?: string): Observable<Responsavel[]> {
    let url = this.apiUrl + '/consultar-todos';
    if (termoBusca) {
      url += '?termoBusca=' + termoBusca;
    }
    return this.http.get<Responsavel[]>(url);
  }

  getById(id: number): Observable<Responsavel> {
    return this.http.get<Responsavel>(`${this.apiUrl}/${id}`);
  }

  save(objeto: Responsavel): Observable<Responsavel> {
    let url = this.apiUrl;
    if (objeto.id) {
      url += '/atualizar';
      return this.http.put<Responsavel>(url, objeto);
    } else {
      url += '/inserir';
      return this.http.post<Responsavel>(url, objeto);
    }
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remover/${id}`);
  }
  
}
