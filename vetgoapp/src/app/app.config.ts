import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { AuthInterceptor } from './interceptors/services/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptorsFromDi()), // diz que vai usar interceptors do DI
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, // registra sua classe
    provideRouter(routes),
  ]
};
