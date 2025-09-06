import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCard } from '@angular/material/card';
import { LoginService } from '../../services/login';
import { Usuario } from '../../models/usuario';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';


@Component({
  standalone: true,
  selector: 'app-login',
  imports: [
    ReactiveFormsModule, FormsModule, CommonModule, HttpClientModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent{

  telefone: string = '';


  formularioLogin: FormGroup;
  erro: string | null = null;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {
    this.formularioLogin = this.fb.group({
      telefone: ['', [Validators.required]]
    });
  }

  fazerLogin(): void {
    if (this.formularioLogin.invalid) {
      this.erro = 'Preencha todos os campos';
      return;
    }

    const usuario = <Usuario>{}
    usuario.telefone = this.formularioLogin.value.telefone;

    try {
      this.loginService.login(usuario);
    } catch (e) {
      this.erro = 'Erro ao realizar login';
      console.error(e);
    }
  }

}
