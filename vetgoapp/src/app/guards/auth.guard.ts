import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/AuthService';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn.pipe(
    map((isLoggedIn: boolean) => {
      if (isLoggedIn) {
        const user = authService.currentUserValue;
        const userRole = user?.papel;
        const isResponsavel = userRole === 'ROLE_RESPONSAVEL';
        const isClientRoute = route.url.some(segment => ['list-cliente', 'form-cliente'].includes(segment.path));
        
        if (isResponsavel && isClientRoute) {
          router.navigate(['/agendamento']);
          return false;
        }

        return true;
      } else {
        router.navigate(['/login']);
        return false;
      }
    })
  );
};