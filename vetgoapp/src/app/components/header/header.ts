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

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.isLoggedIn.subscribe(status => {
      this.isLoggedIn = status;
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