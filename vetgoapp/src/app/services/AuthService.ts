import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Usuario } from '../models/usuario';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // CORREÇÃO: Mantenha esta propriedade, é a fonte da verdade do estado do usuário.
  public currentUser = new BehaviorSubject<Usuario | null>(null);

  // Remova a propriedade 'isLoggedIn' de tipo 'Observable' e use um getter.
  get isLoggedIn(): boolean {
    return !!this.currentUser.value;
  }

  constructor(private router: Router) {
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.login(JSON.parse(user));
    }
  }

  login(usuario: Usuario): void {
    this.currentUser.next(usuario);
    localStorage.setItem('currentUser', JSON.stringify(usuario));
  }

  logout(): void {
    this.currentUser.next(null);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}