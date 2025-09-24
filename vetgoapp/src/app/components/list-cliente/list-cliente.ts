import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { PacienteService } from '../../services/paciente';
import { ResponsavelService } from '../../services/responsavel';
import { Paciente } from '../../models/paciente';
import { Endereco } from '../../models/endereco.model';
import { ResponsavelDTO } from '../../models/responsaveldto';

@Component({
  standalone: true,
  selector: 'app-list-cliente',
  imports: [RouterLink, MatFormFieldModule, MatInputModule, MatMenuModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './list-cliente.html',
  styleUrls: ['./list-cliente.scss']
})
export class ListClienteComponent implements OnInit {
  termoBusca: string = '';

  registros: ResponsavelDTO[] = [];
  registrosFiltrados: ResponsavelDTO[] = [];
  pacientesPorResponsavel: { [key: number]: Paciente[] } = {};
  statusPorResponsavel: { [key: number]: string[] } = {};

  constructor(
    private servico: ResponsavelService,
    private pacienteService: PacienteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.get();
  }

  get(): void {
    this.servico.getComStatusPagamento().subscribe({
      next: (responsaveis: ResponsavelDTO[]) => {
        // Preencher registros e filtro
        this.registros = responsaveis;
        this.registrosFiltrados = [...this.registros];

        // Popular status de pagamentos
        this.registros.forEach(resp => {
          if (resp.id) {
            this.statusPorResponsavel[resp.id] = resp.statusPagamentos || [];
          }
        });

        // Buscar pets de cada responsável
        this.registros.forEach(resp => {
          if (resp.id) {
            this.pacienteService.getByResponsavelId(resp.id).subscribe(pets => {
              this.pacientesPorResponsavel[resp.id!] = pets || [];
            });
          }
        });
      },
      error: (erro) => {
        console.error('Erro ao buscar responsáveis:', erro);
      }
    });
  }

  getPetNames(responsavelId: number): string {
    const pets = this.pacientesPorResponsavel[responsavelId];
    return pets && pets.length > 0 ? pets.map(p => p.nome).join(', ') : 'Nenhum pet';
  }

  getStatusPagamentos(responsavelId: number): string {
    const status = this.statusPorResponsavel[responsavelId];
    return status && status.length > 0 ? status.join(', ') : 'Nenhum pagamento';
  }

  formatAddress(endereco: Endereco | undefined): string {
    if (!endereco) return 'Endereço não disponível';
    const { logradouro, numero, bairro, cidade, estado } = endereco;
    return [logradouro, numero, bairro, cidade, estado].filter(p => !!p).join(', ');
  }

  buscarComTermo(termoBusca: string): void {
    const termo = termoBusca.trim().toLowerCase();
    this.registrosFiltrados = this.registros.filter((responsavel) => {
      const nome = responsavel.nomeUsuario?.toLowerCase() || '';
      const telefone = responsavel.telefone?.toLowerCase() || '';
      const email = responsavel.email?.toLowerCase() || '';
      return nome.includes(termo) || telefone.includes(termo) || email.includes(termo);
    });
  }

  cadastrar(): void {
    this.router.navigate(['/form-cliente']);
  }

  editar(responsavel: ResponsavelDTO): void {
    this.router.navigate(['/form-cliente'], { queryParams: { id: responsavel.id } });
  }

  delete(id: number): void {
    if (window.confirm('Deseja realmente EXCLUIR o responsável?')) {
      this.servico.delete(id).subscribe({
        next: () => this.get(),
        error: (erro) => {
          console.error('Erro ao excluir responsável:', erro);
          alert('Erro ao excluir responsável: ' + (erro.message || 'Erro desconhecido'));
        }
      });
    }
  }

  getWhatsappLink(telefone: string | undefined): string {
    if (!telefone) return '#';
    const telefoneLimpo = telefone.replace(/\D/g, '');
    return `https://wa.me/55${telefoneLimpo}`;
  }
}
