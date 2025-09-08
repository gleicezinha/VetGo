import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Usuario } from '../models/usuario';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.API_URL}/auth`;
  
  private isLoggedInSubject: BehaviorSubject<boolean>;
  public isLoggedIn: Observable<boolean>;

  private currentUserSubject: BehaviorSubject<Usuario | null>;
  public currentUser: Observable<Usuario | null>;

  constructor(private http: HttpClient) {
    const savedUser = localStorage.getItem('currentUser');
    const user = savedUser ? JSON.parse(savedUser) : null;
    
    this.currentUserSubject = new BehaviorSubject<Usuario | null>(user);
    this.isLoggedInSubject = new BehaviorSubject<boolean>(!!user);
    
    this.isLoggedIn = this.isLoggedInSubject.asObservable();
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): Usuario | null {
    return this.currentUserSubject.value;
  }

  // Corrigido para lidar com diferentes estruturas de resposta
  login(response: any): void {
    let user: Usuario | null = null;
    if (response && response.usuario) {
      user = response.usuario;
    } else if (response) {
      user = response;
    }

    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      this.isLoggedInSubject.next(true);
    } else {
      console.error('Dados de usuário inválidos recebidos no login.');
      this.logout();
    }
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
  }

  sendVerificationCode(phone: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-code`, { phone });
  }

  verifyCode(phone: string, code: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-code`, { phone, code });
  }
}