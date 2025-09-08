import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/AuthService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-verify',
  imports: [CommonModule, FormsModule],
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {
  phone: string = '';
  code: string = '';
  message: string = '';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const phoneParam = params.get('phone');
      if (phoneParam) {
        this.phone = phoneParam;
        this.message = `Um código de verificação foi enviado para o número: ${this.phone}`;
      } else {
        this.message = 'Número de telefone não fornecido.';
      }
    });
  }

  verifyCode() {
    this.authService.verifyCode(this.phone, this.code).subscribe({
      next: (res: any) => {
        // Passa a resposta completa para o serviço, que irá extrair o usuário
        this.authService.login(res);
        this.router.navigate(['/agendamento']);
      },
      error: (err) => {
        if (err.status === 400) {
          this.message = 'Código de verificação inválido.';
        } else {
          this.message = 'Erro ao verificar código. Tente novamente.';
        }
        console.error('Erro do servidor:', err);
      }
    });
  }
}