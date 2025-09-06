import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Usuario } from '../models/usuario'; // Certifique-se de que o caminho está correto

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:9000/auth'; // Aponte para o endpoint de autenticação do seu back-end

  // Gerencia o estado do usuário logado
  private currentUserSubject: BehaviorSubject<Usuario | null> = new BehaviorSubject<Usuario | null>(null);
  public currentUser: Observable<Usuario | null> = this.currentUserSubject.asObservable();

  // Gerencia o estado de login
  private isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isLoggedIn: Observable<boolean> = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Método de login: define o usuário e o estado de login
  login(usuario: Usuario): void {
    this.currentUserSubject.next(usuario);
    this.isLoggedInSubject.next(true);
  }

  // Método para fazer logout
  logout(): void {
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
  }

  // Métodos do Twilio
  sendCode(phone: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-code`, { phone });
  }

  verifyCode(phone: string, code: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-code`, { phone, code });
  }

  // Outros métodos úteis
  public get currentUserValue(): Usuario | null {
    return this.currentUserSubject.value;
  }
}