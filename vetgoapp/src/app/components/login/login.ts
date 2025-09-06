import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { LoginService } from '../../services/login';
import { AuthService } from '../../services/AuthService';
import { catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Usuario } from '../../models/usuario';

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
  loginError: string = '';

  constructor(
    private loginService: LoginService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void { }

  logar(): void {
    if (!this.telefone) {
      this.loginError = 'Por favor, digite seu número de telefone.';
      return;
    }
    this.loginError = '';
    
    this.loginService.loginComContato(this.telefone).pipe(
      switchMap((usuario: Usuario) => {
        return this.authService.sendVerificationCode(this.telefone);
      }),
      catchError(error => {
        if (error.status === 404) {
          alert('Contato não cadastrado. Redirecionando para o formulário de cadastro.');
          this.router.navigate(['/form-responsavel']);
        } else {
          this.loginError = 'Erro no login: ' + error.message;
        }
        return of(null);
      })
    ).subscribe((response) => {
      if (response) {
        this.router.navigate(['/verify', this.telefone]);
      }
    });
  }
}