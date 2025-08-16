// ... (imports existentes)
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
export class LoginComponent {
  telefone: string = ''; // Nova propriedade para o telefone

  constructor(private loginService: LoginService, private router: Router) { }

  loginComContato(): void {
    if (this.telefone) {
      this.loginService.loginComContato(this.telefone).subscribe({
        next: (response) => {
          console.log('Login bem-sucedido:', response);
          // Redireciona o usuário para a página principal após o login
          this.router.navigate(['/agendamento']);
        },
        error: (error) => {
          alert(error.message);
        }
      });
    } else {
      alert('Por favor, digite seu número de telefone.');
    }
  }
}