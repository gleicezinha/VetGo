import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { Responsavel } from '../../models/responsavel';
import { CommonModule } from '@angular/common';
import { ResponsavelService } from '../../services/responsavel';
import { Usuario } from '../../models/usuario';
import { Endereco } from '../../models/endereco.model';

@Component({
  standalone: true,
  selector: 'app-form-cliente',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './form-cliente.html',
  styleUrls: ['./form-cliente.scss']
})
export class FormClienteComponent implements OnInit {

  registro: Responsavel = {
    id: 0,
    usuario: {
      id: 0,
      nomeUsuario: '',
      email: '',
      telefone: '',
      cpf: '',
      ativo: true,
      papel: 'ROLE_RESPONSAVEL',
      endereco: {
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: ''
      }
    }
  };

  ufs = [
    { sigla: 'AC', nome: 'Acre' },
    { sigla: 'AL', nome: 'Alagoas' },
    { sigla: 'AP', nome: 'Amapá' },
    { sigla: 'AM', nome: 'Amazonas' },
    { sigla: 'BA', nome: 'Bahia' },
    { sigla: 'CE', nome: 'Ceará' },
    { sigla: 'DF', nome: 'Distrito Federal' },
    { sigla: 'ES', nome: 'Espírito Santo' },
    { sigla: 'GO', nome: 'Goiás' },
    { sigla: 'MA', nome: 'Maranhão' },
    { sigla: 'MT', nome: 'Mato Grosso' },
    { sigla: 'MS', nome: 'Mato Grosso do Sul' },
    { sigla: 'MG', nome: 'Minas Gerais' },
    { sigla: 'PA', nome: 'Pará' },
    { sigla: 'PB', nome: 'Paraíba' },
    { sigla: 'PR', nome: 'Paraná' },
    { sigla: 'PE', nome: 'Pernambuco' },
    { sigla: 'PI', nome: 'Piauí' },
    { sigla: 'RJ', nome: 'Rio de Janeiro' },
    { sigla: 'RN', nome: 'Rio Grande do Norte' },
    { sigla: 'RS', nome: 'Rio Grande do Sul' },
    { sigla: 'RO', nome: 'Rondônia' },
    { sigla: 'RR', nome: 'Roraima' },
    { sigla: 'SC', nome: 'Santa Catarina' },
    { sigla: 'SP', nome: 'São Paulo' },
    { sigla: 'SE', nome: 'Sergipe' },
    { sigla: 'TO', nome: 'Tocantins' }
  ];

  constructor(
    private servico: ResponsavelService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.queryParamMap.get('id');
    if (id) {
      this.servico.getById(+id).subscribe({
        next: (resposta: Responsavel) => {
          this.registro = resposta;

          if (!this.registro.usuario) {
            this.registro.usuario = { endereco: {} as Endereco } as Usuario;
          }
          if (!this.registro.usuario.endereco) {
            this.registro.usuario.endereco = {} as Endereco;
          }
        },
        error: (err) => {
          console.error('Erro ao buscar cliente:', err);
        }
      });
    }
  }


  save(): void {
    this.servico.save(this.registro).subscribe({
      complete: () => {
        alert('Responsável cadastrado com sucesso!');
        this.router.navigate(['/list-cliente']);
      },
      error: (err) => {
        console.error('Erro ao salvar o responsável:', err);
      }
    });
  }
  cadastrarpet(): void {
    console.log('Dados do responsável antes de salvar:', this.registro);

    this.servico.save(this.registro).subscribe({
      next: (responsavelSalvo: Responsavel) => {
        console.log('Responsável salvo com sucesso:', responsavelSalvo);

        if (responsavelSalvo.id) {
          alert('Responsável salvo com sucesso! Redirecionando para cadastro de Pet.');
          this.router.navigate(['/form-pet'], {
            queryParams: { responsavelId: responsavelSalvo.id }
          });
        }
      },
      error: (err) => {
        console.error('Erro detalhado ao salvar o responsável:', err);
        alert(`Erro ao salvar o responsável: ${err.message || 'Erro desconhecido'}`);
      }
    });
  }
}