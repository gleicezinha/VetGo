import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/AuthService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-verify',
  imports: [CommonModule, FormsModule],
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss'] // Confirme se o arquivo existe ou remova a linha
})
export class VerifyComponent implements OnInit {
  phone: string = '';
  code: string = '';
  message: string = '';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute, // Injete o ActivatedRoute
    private router: Router // Injete o Router
  ) {}

  ngOnInit(): void {
    // Obtém o número de telefone da URL
    this.route.paramMap.subscribe(params => {
      const phoneParam = params.get('phone');
      if (phoneParam) {
        this.phone = phoneParam;
        this.message = 'Código enviado para ' + this.phone;
      } else {
        this.message = 'Número de telefone não fornecido.';
      }
    });
  }

  // A função sendCode() não é mais necessária

  verifyCode() {
    this.authService.verifyCode(this.phone, this.code).subscribe({
      next: (res) => {
        if (res.status === 'approved') {
          this.message = '✅ Verificação concluída!';
          // Após a verificação, você pode redirecionar o usuário
          // para a tela principal (ex: agendamento)
          this.router.navigate(['/agendamento']);
        } else {
          this.message = '❌ Código inválido';
        }
      },
      error: (err) => {
        this.message = 'Erro: ' + err.error.error;
      }
    });
  }
}