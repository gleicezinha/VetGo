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
        // Verifica se a resposta contém os dados do usuário
        if (res && res.usuario) {
          // Autentica o usuário no AuthService
          this.authService.login(res.usuario);
          // Redireciona para o agendamento
          this.router.navigate(['/agendamento']);
        } else if (res && res.status === 'approved') {
          // Se o back-end retorna apenas o status, você precisa buscar o usuário
          // Esta é uma lógica alternativa, caso o back-end não retorne o objeto completo
          this.message = 'Verificação concluída, mas sem dados do usuário. Faça login novamente.';
          this.router.navigate(['/login']);
        } else {
          this.message = '❌ Código inválido.';
        }
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