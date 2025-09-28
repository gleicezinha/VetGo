// src/app/components/list-cliente/list-cliente.ts
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { of, forkJoin, switchMap, Observable } from 'rxjs'; // [MOD] Adicionado forkJoin, switchMap, Observable

import { PacienteService } from '../../services/paciente';
import { ResponsavelService } from '../../services/responsavel';
import { Paciente } from '../../models/paciente';
import { Endereco } from '../../models/endereco.model';
import { ResponsavelDTO } from '../../models/responsaveldto';
import { Page } from '../../models/page.model'; // [NOVO IMPORT]

// NEW INTERFACE: Estrutura para os detalhes do pagamento e o link.
interface PagamentoStatus {
  status: string;
  atendimentoId: number | null;
}

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
  
  // NOVO: Usaremos esta propriedade para armazenar os detalhes de pagamento
  pagamentosDetalhes: { [key: number]: PagamentoStatus[] } = {};

  // [NOVO] Estado de paginação
  page: number = 0;
  size: number = 6;
  totalPages: number = 0;
  totalElements: number = 0;


  constructor(
    private servico: ResponsavelService,
    private pacienteService: PacienteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.get();
  }

  // [MOD] Implementa paginação e processa a nova string de status
  get(page: number = this.page): void {
    this.page = page;

    this.servico.getComStatusPagamento(this.termoBusca, this.page, this.size).subscribe({
      next: (pageResponse: Page<ResponsavelDTO>) => {
        
        this.totalPages = pageResponse.totalPages;
        this.totalElements = pageResponse.totalElements;
        this.registros = pageResponse.content;
        
        // Resetar o filtro para mostrar a página atual
        this.registrosFiltrados = [...this.registros];
        
        // NOVO BLOCO: Popular DADOS de pagamentos detalhados (Parsing da string STATUS|ID)
        this.pagamentosDetalhes = {}; 
        this.registros.forEach(resp => {
          if (resp.id && resp.statusPagamentos) {
            this.pagamentosDetalhes[resp.id] = resp.statusPagamentos.map(encoded => {
              const parts = encoded.split('|');
              // A string é no formato "STATUS|ATENDIMENTO_ID"
              const status = parts[0];
              const idStr = parts[1];
              // Se a ID for "N/A", é nulo.
              const atendimentoId = idStr === 'N/A' || !idStr ? null : parseInt(idStr, 10); 
              return { status, atendimentoId };
            });
          }
        });

        // Buscar pets de cada responsável (mantendo a busca de pets por página)
        this.pacientesPorResponsavel = {}; 
        const petCalls: Observable<any>[] = this.registros.map(resp => {
            if (resp.id) {
                return this.pacienteService.getByResponsavelId(resp.id).pipe(
                    switchMap(pets => {
                        this.pacientesPorResponsavel[resp.id!] = pets || [];
                        return of(true);
                    })
                );
            }
            return of(false);
        });

        if (petCalls.length > 0) {
            forkJoin(petCalls).subscribe({
                complete: () => {
                    this.buscarComTermo(this.termoBusca, true); // Re-aplica o filtro após carregar os pets (apenas localmente)
                }
            });
        } else {
             this.buscarComTermo(this.termoBusca, true);
        }
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

  // MÉTODO ORIGINAL, MANTIDO POR COMPATIBILIDADE, MAS AGORA TEMOS getPagamentoDetalhes
  getStatusPagamentos(responsavelId: number): string {
    const status = this.statusPorResponsavel[responsavelId];
    return status && status.length > 0 ? status.join(', ') : 'Nenhum pagamento';
  }
  
  // NOVO MÉTODO: Retorna a lista de detalhes do pagamento para o template.
  getPagamentoDetalhes(responsavelId: number): PagamentoStatus[] {
    return this.pagamentosDetalhes[responsavelId] || [];
  }

  formatAddress(endereco: Endereco | undefined): string {
    if (!endereco) return 'Endereço não disponível';
    const { logradouro, numero, bairro, cidade, estado } = endereco;
    return [logradouro, numero, bairro, cidade, estado].filter(p => !!p).join(', ');
  }

  // [MOD] Adiciona o parâmetro skipApiCall para forçar o filtro local
  buscarComTermo(termoBusca: string, skipApiCall: boolean = false): void {
    if (skipApiCall) {
         const termo = termoBusca.trim().toLowerCase();
    
        this.registrosFiltrados = this.registros.filter((responsavel) => {
          const id = responsavel.id;
          const nome = responsavel.nomeUsuario?.toLowerCase() || '';
          const telefone = responsavel.telefone?.toLowerCase() || '';
          const email = responsavel.email?.toLowerCase() || '';
          
          // Busca pelo nome dos pets
          const pets = this.pacientesPorResponsavel[id!];
          const nomeDosPets = pets?.map(p => p.nome.toLowerCase()).join(' ') || '';

          return nome.includes(termo) || 
                 telefone.includes(termo) || 
                 email.includes(termo) ||
                 nomeDosPets.includes(termo); 
        });
    } else {
        // Reinicia a paginação para a primeira página ao buscar um novo termo
        this.page = 0;
        this.get(this.page);
    }
  }
  
  // [NOVO MÉTODO] Lógica de paginação
  irParaPagina(pagina: number): void {
    if (pagina >= 0 && pagina < this.totalPages) {
      this.get(pagina);
    }
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
        next: () => this.get(this.page), // [MOD] Recarrega a página atual
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