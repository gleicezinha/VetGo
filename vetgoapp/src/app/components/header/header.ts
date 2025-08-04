import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, RouterLink, RouterModule, MatMenuModule, MatButtonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header implements OnInit {
  title = 'vetgoapp';
  menuOpen = false;


  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  ngOnInit(): void {


  }
}