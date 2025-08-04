import { CommonModule, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [NgClass, RouterLink, CommonModule, RouterOutlet,     MatInputModule,
    MatIconModule,
    MatCheckboxModule,
    MatCardModule,
    MatToolbarModule,
    MatTableModule,
   ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent implements OnInit {
  title = 'vetgoapp';
  menuOpen = false;
  nomeUsuario: string | null = '';
  papelUsuario: string | null = '';



  ngOnInit(): void {
    this.atualizarInformacoesUsuario();
  }

  atualizarInformacoesUsuario(): void {
    const nomeAtual = sessionStorage.getItem('nomeUsuario');
    const papelAtual = sessionStorage.getItem('papelUsuario');

    if (this.nomeUsuario !== nomeAtual || this.papelUsuario !== papelAtual) {
      this.nomeUsuario = nomeAtual;
      this.papelUsuario = papelAtual;
    }
  }
  

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

}