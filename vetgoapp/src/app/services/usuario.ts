import { Injectable } from '@angular/core';
import { ICrudService } from './i-crud-service';
import { environment } from '../../environments/environment';
import { Usuario } from '../models/usuario';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService implements ICrudService<Usuario> {
  // CORREÇÃO: A URL foi ajustada para o endpoint correto
  public apiUrl: string = environment.API_URL + '/config/usuario';

  constructor(private http: HttpClient) { }

  get(termoBusca?: string): Observable<Usuario[]> {
    let url = this.apiUrl + '/consultar/todos'; // Endpoint de consulta
    if (termoBusca) {
      url += '?termoBusca=' + termoBusca;
    }
    return this.http.get<Usuario[]>(url);
  }

  getById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  save(objeto: Usuario): Observable<Usuario> {
    let url = this.apiUrl;
    if (objeto.id) {
      // CORREÇÃO: Endpoint de atualização
      url += '/atualizar';
      return this.http.put<Usuario>(url, objeto);
    } else {
      // CORREÇÃO: Endpoint de inserção
      url += '/inserir';
      return this.http.post<Usuario>(url, objeto);
    }
  }

  delete(id: number): Observable<void> {
    // CORREÇÃO: Endpoint de remoção
    return this.http.delete<void>(`${this.apiUrl}/remover/${id}`);
  }
}