import { inject } from '@angular/core';
import { Router, CanActivateFn, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // A guarda de rota agora observa o status de login do serviço
  return authService.isLoggedIn.pipe(
    map(isLoggedIn => {
      if (isLoggedIn) {
        return true; // Permite o acesso se o usuário estiver logado
      } else {
        // Redireciona para a página de login se o usuário não estiver logado
        return router.parseUrl('/login');
      }
    })
  );
};
