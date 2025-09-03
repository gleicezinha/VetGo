import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { LoginService } from '../../services/login';
import { Usuario } from '../../models/usuario';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { ResponsavelService } from '../../services/responsavel';
import { AuthService } from '../../services/AuthService';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [
    ReactiveFormsModule, FormsModule, CommonModule, HttpClientModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent implements OnInit {

  telefone: string = '';

  constructor(
    private loginService: LoginService, 
    private router: Router,
    private authService: AuthService,
    private responsavelService: ResponsavelService
  ) { }

  ngOnInit(): void { }

  logar(): void {
    if (this.telefone) {
      this.loginService.loginComContato(this.telefone).pipe(
        switchMap((usuario: Usuario) => {
          this.authService.login(usuario);
          if (usuario.papel === 'ROLE_RESPONSAVEL') {
            return this.responsavelService.getByUsuarioId(usuario.id);
          } else {
            return of({ id: usuario.id });
          }
        })
      ).subscribe({
        next: (response: any) => {
          // Acesso corrigido ao valor do BehaviorSubject
          const userRole = this.authService.currentUser.value?.papel;
          if (userRole === 'ROLE_RESPONSAVEL') {
            this.router.navigate(['/animais-cliente', response.id]);
          } else {
            this.router.navigate(['/list-cliente']);
          }
        },
        error: (error) => {
          if (error.message.includes('Contato não cadastrado')) {
            alert('Contato não cadastrado. Redirecionando para o formulário de cadastro.');
            this.router.navigate(['/form-cliente']);
          } else {
            alert(error.message);
          }
        }
      });
    } else {
      alert('Por favor, digite seu número de telefone.');
    }
  }
}