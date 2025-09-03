import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterModule, Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/AuthService';

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
  
  // PROPRIEDADES CORRIGIDAS
  userRole: string | null = null;
  currentUserId: number | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    // Assina as mudanças no estado de login e nos dados do usuário
    this.authService.isLoggedIn.subscribe(status => {
      this.isLoggedIn = status;
    });

    this.authService.currentUser.subscribe(user => {
      this.userRole = user ? user.papel : null;
      this.currentUserId = user ? user.id : null;
    });
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }
  
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}