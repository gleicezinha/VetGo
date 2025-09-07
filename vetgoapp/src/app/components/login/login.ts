import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/AuthService';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  telefone: string = '';
  message: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  logar(form: NgForm) {
    if (!form.valid) return;

    this.authService.sendVerificationCode(this.telefone).subscribe({
      next: () => {
        // Redireciona para a página de verificação, passando o telefone
        this.router.navigate(['/verify', this.telefone]);
      },
      error: (err) => {
        if (err.status === 404) {
          this.message = 'Telefone não cadastrado.';
        } else {
          this.message = 'Erro ao enviar código. Tente novamente.';
        }
        console.error('Erro do servidor:', err);
      }
    });
  }
}
