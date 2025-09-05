import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

import { Injectable } from '@angular/core';
import { Erro } from '../../models/erro';

export const ErroInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError(erro => {
      let erroDoBack: Erro = erro.error || "Falha na requisição";
      alert(String(erroDoBack.message));
      return throwError(() => erro);
    })
  );
};
