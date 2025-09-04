import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = environment.API_URL + '/api/login/contato';

  constructor(private http: HttpClient) { }

  loginComContato(telefone: string): Observable<Usuario> {
    const usuario: Partial<Usuario> = { telefone };
    return this.http.post<Usuario>(this.apiUrl, usuario)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro desconhecido!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro do lado do cliente: ${error.error.message}`;
    } else {
      if (error.status === 404) {
        errorMessage = 'Contato não cadastrado.';
      } else {
        errorMessage = `Erro do servidor: Código ${error.status}, mensagem: ${error.message}`;
      }
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}