import { Component, OnInit } from '@angular/core';
import { ICrudList } from '../i-crud-list';
import { Responsavel } from '../../models/responsavel';
import { ResponsavelService } from '../../services/responsavel';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PacienteService } from '../../services/paciente';
import { forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Paciente } from '../../models/paciente';
import { Endereco } from '../../models/endereco.model';

@Component({
  standalone: true,
  selector: 'app-list-cliente',
  imports: [RouterLink, MatFormFieldModule, MatInputModule, MatMenuModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './list-cliente.html',
  styleUrls: ['./list-cliente.scss']
})
export class ListClienteComponent implements ICrudList<Responsavel>, OnInit {
  termoBusca: string = '';

  registros: Responsavel[] = [];
  registrosFiltrados: Responsavel[] = [];
  pacientesPorResponsavel: { [key: number]: Paciente[] } = {};

  constructor(
    private servico: ResponsavelService,
    private pacienteService: PacienteService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.get();
    
  }

  get(): void {
    this.servico.get().pipe(
      switchMap((responsaveis: Responsavel[]) => {
        this.registros = responsaveis;
        this.registrosFiltrados = responsaveis;

        const pacienteCalls = responsaveis.map(resp =>
          resp.id ? this.pacienteService.getByResponsavelId(resp.id) : of([])
        );

        if (pacienteCalls.length === 0) {
          return of([]);
        }

        return forkJoin(pacienteCalls);
      })
    ).subscribe({
      next: (pacientesList: Paciente[][]) => {
        pacientesList.forEach((pacientes, index) => {
          const responsavelId = this.registros[index].id;
          if (responsavelId) {
            this.pacientesPorResponsavel[responsavelId] = pacientes;
          }
        });
      },
      error: (erro) => {
        console.error('Erro ao buscar dados:', erro);
      },
    });
  }

  getPetNames(responsavelId: number): string {
    const pets = this.pacientesPorResponsavel[responsavelId];
    return pets && pets.length > 0
      ? pets.map(p => p.nome).join(', ')
      : 'Nenhum pet';
  }

  formatAddress(endereco: Endereco | undefined): string {
    if (!endereco) {
      return 'Endereço não disponível';
    }
    const { logradouro, numero, bairro, cidade, estado } = endereco;
    const partes = [logradouro, numero, bairro, cidade, estado].filter(p => !!p);
    return partes.length > 0 ? partes.join(', ') : 'Endereço não disponível';
  }

  buscarComTermo(termoBusca: string): void {
    const termo = termoBusca.trim().toLowerCase();

    this.registrosFiltrados = this.registros.filter((responsavel) => {
      const nomeUsuario = responsavel.usuario?.nomeUsuario?.toLowerCase() || '';
      const telefone = responsavel.usuario?.telefone?.toLowerCase() || '';
      const email = responsavel.usuario?.email?.toLowerCase() || '';

      return nomeUsuario.includes(termo) || telefone.includes(termo) || email.includes(termo);
    });
  }

  cadastrar(): void {
    this.router.navigate(['/form-cliente']);
  }

  editar(responsavel: Responsavel): void {
    this.router.navigate(['/form-cliente'], { queryParams: { id: responsavel.id } });
  }
  
  // Nova função para criar o link do WhatsApp
  getWhatsappLink(telefone: string | undefined): string {
    if (!telefone) {
      return '#';
    }
    const telefoneLimpo = telefone.replace(/\D/g, ''); // Remove caracteres não numéricos
    return `https://wa.me/55${telefoneLimpo}`; // Adiciona o código do país do Brasil
  }

  delete(id: number): void {
    if (window.confirm('Deseja realmente EXCLUIR o responsável?')) {
      this.servico.delete(id).subscribe({
        next: () => {
          this.get();
        },
        error: (erro) => {
          console.error('Erro ao excluir responsável:', erro);
          alert('Erro ao excluir responsável: ' + (erro.message || 'Erro desconhecido'));
        }
      });
    }
  }
}