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
        this.message = 'Código enviado para ' + this.phone;
      } else {
        this.message = 'Número de telefone não fornecido.';
      }
    });
  }

  verifyCode() {
    this.authService.verifyCode(this.phone, this.code).subscribe({
      next: res => {
        console.log('Código verificado:', res);
        // redireciona para home ou dashboard
        this.router.navigate(['/agendamento']);
      },
      error: err => {
        console.error('Erro do servidor:', err);
        this.message = err.error || 'Código inválido ou expirado.';
      }
    });
  }
}
