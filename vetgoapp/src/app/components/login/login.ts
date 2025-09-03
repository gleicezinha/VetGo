// ... importações existentes
import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario';
import { LoginService } from '../../services/login';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  standalone: true,
  selector: 'app-login',
  imports: [
 FormsModule, CommonModule, HttpClientModule
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
        next: (usuario: Usuario) => { // O tipo de retorno é Usuario
          console.log('Login bem-sucedido:', usuario);

          // Redireciona com base no papel do usuário
          switch (usuario.papel) {
            case 'ROLE_RESPONSAVEL':
              this.router.navigate(['/animais-cliente', usuario.id]);
              break;
            case 'ROLE_PROFISSIONAL':
            case 'ROLE_ADMIN':
              this.router.navigate(['/list-cliente']);
              break;
            default:
              alert('Papel de usuário não reconhecido.');
              this.router.navigate(['/login']);
              break;
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