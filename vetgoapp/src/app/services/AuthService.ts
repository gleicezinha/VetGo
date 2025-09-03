import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Usuario } from '../models/usuario';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isLoggedIn = new BehaviorSubject<boolean>(false);
  
  // CORREÇÃO: Mude a visibilidade e o tipo para o BehaviorSubject
  public currentUser = new BehaviorSubject<Usuario | null>(null);

  isLoggedIn: Observable<boolean> = this._isLoggedIn.asObservable();

  constructor(private router: Router) {
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.login(JSON.parse(user));
    }
  }

  login(usuario: Usuario): void {
    this._isLoggedIn.next(true);
    this.currentUser.next(usuario); // Use o BehaviorSubject
    localStorage.setItem('currentUser', JSON.stringify(usuario));
  }

  logout(): void {
    this._isLoggedIn.next(false);
    this.currentUser.next(null); // Use o BehaviorSubject
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}