import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../models/usuario';
import { AuthService } from '../../services/AuthService';
import { UsuarioService } from '../../services/usuario';
import { Endereco } from '../../models/endereco.model';

@Component({
    selector: 'app-usuario',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './usuario.html',
    styleUrls: ['./usuario.scss']
})
export class UsuarioComponent implements OnInit {

    usuario: Usuario = {
        id: 0,
        nomeUsuario: '',
        email: '',
        telefone: '',
        cpf: '',
        ativo: true,
        papel: 'ROLE_RESPONSAVEL',
        endereco: {} as Endereco
    };

    constructor(
        private authService: AuthService,
        private usuarioService: UsuarioService
    ) { }

    ngOnInit(): void {
        const currentUser = this.authService.currentUserValue;
        if (currentUser && currentUser.id) {
            this.usuarioService.getById(currentUser.id).subscribe({
                next: (user) => {
                    this.usuario = user;
                    if (!this.usuario.endereco) {
                        this.usuario.endereco = {} as Endereco;
                    }
                },
                error: (err) => console.error('Erro ao buscar dados do usuário:', err)
            });
        }
    }

    salvar(): void {
        if (this.usuario && this.usuario.id) {
            this.usuarioService.save(this.usuario).subscribe({
                next: (usuarioAtualizado) => {
                    alert('Perfil atualizado com sucesso!');
                    // Atualiza o usuário no AuthService para refletir as mudanças globalmente
                    this.authService.login(usuarioAtualizado);
                },
                error: (err) => {
                    console.error('Erro ao atualizar o perfil:', err);
                    alert('Não foi possível atualizar o perfil.');
                }
            });
        }
    }
}