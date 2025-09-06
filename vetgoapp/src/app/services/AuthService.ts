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
  
  private isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isLoggedIn: Observable<boolean> = this.isLoggedInSubject.asObservable();

  private currentUserSubject: BehaviorSubject<Usuario | null> = new BehaviorSubject<Usuario | null>(null);
  public currentUser: Observable<Usuario | null> = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  public get currentUserValue(): Usuario | null {
    return this.currentUserSubject.value;
  }

  login(usuario: Usuario): void {
    this.currentUserSubject.next(usuario);
    this.isLoggedInSubject.next(true);
  }

  logout(): void {
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
  }

  // Método corrigido para 'sendVerificationCode'
  sendVerificationCode(phone: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-code`, { phone });
  }

  verifyCode(phone: string, code: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-code`, { phone, code });
  }
}