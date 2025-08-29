import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn = this.loggedInSubject.asObservable();

  login(): void {
    this.loggedInSubject.next(true);
  }

  logout(): void {
    this.loggedInSubject.next(false);
  }
}