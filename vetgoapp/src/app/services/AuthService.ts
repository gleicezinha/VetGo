import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  sendCode(phone: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-code`, { phone });
  }

  verifyCode(phone: string, code: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-code`, { phone, code });
  }
}
