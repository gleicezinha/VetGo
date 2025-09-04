import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterModule, Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/AuthService';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [MatToolbarModule, RouterLink, RouterModule, MatMenuModule, MatButtonModule, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header implements OnInit {
  title = 'vetgoapp';
  menuOpen = false;
  isLoggedIn: boolean = false;
  
  userRole: string | null = null;
  currentUserId: number | null = null;
  private userSubscription: Subscription | undefined;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    // Inscreve-se no BehaviorSubject para reagir às mudanças de login
    this.userSubscription = this.authService.currentUser.subscribe(user => {
      this.isLoggedIn = !!user; // Converte o objeto usuário para um booleano
      this.userRole = user ? user.papel : null;
      this.currentUserId = user ? user.id : null;
    });
  }

  // É boa prática desinscrever-se do Observable quando o componente é destruído
  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }
  
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}