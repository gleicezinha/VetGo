import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/AuthService';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // A API usa autenticação HTTP Basic, então não é necessário adicionar
  // cabeçalhos de token JWT. A lógica principal do interceptor aqui
  // é capturar respostas de erro.

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Se a API retornar um erro 401 ou 403, o usuário não está autenticado.
      if (error.status === 401 || error.status === 403) {
        // Desloga o usuário e o redireciona para a página de login
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};