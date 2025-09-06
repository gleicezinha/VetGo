import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Usuario } from '../models/usuario';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isLoggedIn = new BehaviorSubject<boolean>(false);

  public currentUser = new BehaviorSubject<Usuario | null>(null);

  isLoggedIn: Observable<boolean> = this._isLoggedIn.asObservable();

  constructor(private router: Router) {

    // ================================================================
    // || BLOCO PARA DESATIVAR O LOGIN E SIMULAR USUÁRIO LOGADO      ||
    // ================================================================

    const mockUser: Usuario = {
      id: 1,
      nomeUsuario: 'Veterinário Teste',
      email: 'teste@vetgo.com',
      telefone: '00000000000',
      cpf: '000.000.000-00',
      ativo: true,
      papel: 'ROLE_PROFISSIONAL',
      // CORREÇÃO AQUI: O objeto de endereço precisa ter todas as propriedades
      endereco: {
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: ''
      }
    };

    this.login(mockUser);

    // ================================================================

    /*
    // CÓDIGO ORIGINAL COMENTADO
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.login(JSON.parse(user));
    }
    */
  }

  login(usuario: Usuario): void {
    this._isLoggedIn.next(true);
    this.currentUser.next(usuario);
    localStorage.setItem('currentUser', JSON.stringify(usuario));
  }

  logout(): void {
    this._isLoggedIn.next(false);
    this.currentUser.next(null);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}