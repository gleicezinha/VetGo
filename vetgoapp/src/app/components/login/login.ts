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
  selector: 'app-login',
  imports: [FormsModule, CommonModule, HttpClientModule],
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  telefone: string = '';
  mensagem: string = '';

  constructor(private authService: AuthService, private router: Router) {}

    logar() {
    this.authService.sendVerificationCode(this.telefone).subscribe({
      next: res => {
        console.log('Código enviado:', res);
        // Redireciona para a página de verificação
        this.router.navigate(['/verify', this.telefone]);
      },
      error: err => {
        if (err.status === 404) {
          // Telefone não cadastrado → redireciona para cadastro
          this.router.navigate(['/cadastro', this.telefone]);
        } else if (err.status === 500) {
          this.mensagem = 'Erro interno ao enviar o código. Tente novamente.';
        } else {
          this.mensagem = 'Erro inesperado.';
        }
        console.error('Erro do servidor:', err);
      }
    });
    }
}
