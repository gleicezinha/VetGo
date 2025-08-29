// vetgoapp/src/app/components/login/login.ts

import { Router } from '@angular/router';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login';


@Component({
  standalone: true,
  selector: 'app-login',
  imports: [
    ReactiveFormsModule, MatCheckboxModule, MatInputModule, MatButtonModule,
    MatSelectModule, FormsModule, CommonModule, HttpClientModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent implements OnInit {

  telefone: string = '';

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit(): void { }

  logar(): void {
    if (this.telefone) {
      this.loginService.loginComContato(this.telefone).subscribe({
        next: (response) => {
          console.log('Login bem-sucedido:', response);
          this.router.navigate(['/agendamento']);
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