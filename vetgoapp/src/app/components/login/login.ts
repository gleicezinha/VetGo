import { Component, OnDestroy } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/AuthService';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent implements OnDestroy {
  telefone: string = '';
  message: string = '';
  showAlert: boolean = false;
  countdown: number = 10;
  private unsubscribe$ = new Subject<void>();

  constructor(private authService: AuthService, private router: Router) {}

  logar(form: NgForm) {
    if (!form.valid) return;
    this.showAlert = false;

    this.authService.sendVerificationCode(this.telefone).subscribe({
      next: () => {
        this.router.navigate(['/verify', this.telefone]);
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 404) {
          this.message = 'Telefone não cadastrado. Caso já seja cliente e tenha mudado de número, por favor, entre em contato com a secretaria. Você será redirecionado para a tela de cadastro em ' + this.countdown + ' segundos.';
          this.showAlert = true;

          interval(1000)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(() => {
              this.countdown--;
              if (this.countdown === 0) {
                this.unsubscribe$.next();
                this.unsubscribe$.complete();
                this.router.navigate(['/form-cliente']);
              }
            });

        } else {
          this.message = 'Erro ao enviar código. Tente novamente.';
          this.showAlert = true;
        }
        console.error('Erro do servidor:', err);
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}