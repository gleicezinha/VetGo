import { Component } from '@angular/core';
import { AuthService } from '../../services/AuthService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./verify.component.css']
})

export class VerifyComponent {
  phone = '';
  code = '';
  step = 1;
  message = '';

  constructor(private authService: AuthService) {}

  sendCode() {
    this.authService.sendCode(this.phone).subscribe({
      next: (res) => {
        this.message = 'Código enviado para WhatsApp ✅';
        this.step = 2;
      },
      error: (err) => {
        this.message = 'Erro: ' + err.error.error;
      }
    });
  }

  verifyCode() {
    this.authService.verifyCode(this.phone, this.code).subscribe({
      next: (res) => {
        if (res.status === 'approved') {
          this.message = '✅ Verificação concluída!';
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
