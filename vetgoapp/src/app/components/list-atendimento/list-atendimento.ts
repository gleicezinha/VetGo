// src/app/components/list-atendimento/list-atendimento.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AtendimentoService } from '../../services/atendimento';
import { AtendimentoResponseDTO } from '../../models/atendimento-response.dto';
import { AuthService } from '../../services/AuthService';
import { ResponsavelService } from '../../services/responsavel';
import { PacienteService } from '../../services/paciente';
import { forkJoin, of, switchMap, Observable } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Page } from '../../models/page.model';

@Component({
    selector: 'app-list-atendimento',
    standalone: true,
    imports: [CommonModule, DatePipe, RouterModule, MatMenuModule, MatButtonModule, FormsModule],
    templateUrl: './list-atendimento.html',
    styleUrls: ['./list-atendimento.scss']
})
export class ListAtendimentoComponent implements OnInit {

    atendimentos: AtendimentoResponseDTO[] = [];
    userRole: string | null = null;
    atendimentosFiltrados: AtendimentoResponseDTO[] = [];

    // --- NOVAS PROPRIEDADES PARA FILTRO E ORDENAÇÃO ---
    termoBusca: string = '';
    dataInicioFiltro: string = '';
    dataFimFiltro: string = '';
    ordenacao: string = 'dataHoraAtendimento,desc'; // 'desc' para mais recentes primeiro

    // Estado de paginação
    page: number = 0;
    size: number = 6;
    totalPages: number = 0;
    totalElements: number = 0;

    constructor(
        private atendimentoService: AtendimentoService,
        private router: Router,
        private cdr: ChangeDetectorRef,
        private authService: AuthService,
        private responsavelService: ResponsavelService,
        private pacienteService: PacienteService
    ) { }

    ngOnInit(): void {
        this.authService.currentUser.subscribe(user => {
            this.userRole = user?.papel ?? null;
            this.carregarAtendimentos();
        });
    }

    // MÉTODO MODIFICADO para aceitar a ordenação
    carregarAtendimentos(page: number = this.page): void {
        this.page = page;
        const user = this.authService.currentUserValue;

        if (user && user.papel === 'ROLE_RESPONSAVEL') {
            this.carregarAtendimentosResponsavel();
            this.totalPages = 0;
        } else {
            // Passa a ordenação para o serviço
            this.atendimentoService.getAll(this.termoBusca, this.page, this.size, this.ordenacao).subscribe({
                next: (pageResponse: Page<AtendimentoResponseDTO>) => {
                    this.atendimentos = pageResponse.content;
                    this.totalPages = pageResponse.totalPages;
                    this.totalElements = pageResponse.totalElements;
                    // Aplica o filtro de data após receber os dados
                    this.aplicarFiltroLocal();
                    this.cdr.detectChanges();
                },
                error: (err) => {
                    console.error('Erro ao carregar todos os atendimentos:', err);
                }
            });
        }
    }

    carregarAtendimentosResponsavel(): void {
        const user = this.authService.currentUserValue;
        if (!user) return;

        this.responsavelService.getByUsuarioId(user.id).pipe(
            switchMap(responsavel => responsavel && responsavel.id ? this.pacienteService.getByResponsavelId(responsavel.id) : of([])),
            switchMap(pacientes => {
                if (pacientes.length === 0) return of([]);
                const atendimentoCalls = pacientes.map(paciente => this.atendimentoService.getAtendimentosByResponsavelId(paciente.id));
                return forkJoin(atendimentoCalls);
            })
        ).subscribe({
            next: (atendimentosPorPaciente) => {
                const todosAtendimentos = atendimentosPorPaciente.flat().map(atendimento => ({ ...atendimento } as AtendimentoResponseDTO));
                this.atendimentos = todosAtendimentos;
                this.aplicarFiltroLocal();
            },
            error: (err) => console.error('Erro ao carregar atendimentos do responsável:', err)
        });
    }

    // MÉTODO MODIFICADO para incluir filtro de data
    aplicarFiltroLocal(): void {
        let items = [...this.atendimentos];
        const termo = this.termoBusca.trim().toLowerCase();

        // 1. Filtro por termo de busca
        if (termo) {
            items = items.filter(atd =>
                [atd.nomePaciente, atd.tipoDeAtendimento, atd.nomeProfissional, atd.nomeResponsavel, atd.status]
                    .some(field => field?.toLowerCase().includes(termo))
            );
        }

        // 2. Filtro por data de início
        if (this.dataInicioFiltro) {
            items = items.filter(atd => atd.dataHoraAtendimento.split('T')[0] >= this.dataInicioFiltro);
        }

        // 3. Filtro por data de fim
        if (this.dataFimFiltro) {
            items = items.filter(atd => atd.dataHoraAtendimento.split('T')[0] <= this.dataFimFiltro);
        }

        this.atendimentosFiltrados = items;
        this.cdr.detectChanges();
    }

    // NOVO MÉTODO: Chamado quando qualquer filtro ou ordenação é alterado
    aplicarFiltrosEordenacao(): void {
        // Para administradores, a busca e ordenação recarregam os dados do backend
        if (this.userRole !== 'ROLE_RESPONSAVEL') {
            this.page = 0; // Reinicia para a primeira página
            this.carregarAtendimentos();
        } else {
            // Para o responsável, a ordenação e filtros são locais
            this.ordenarLocalmente();
            this.aplicarFiltroLocal();
        }
    }

    // NOVO MÉTODO: Ordena os dados para o perfil "Responsável"
    ordenarLocalmente(): void {
        const [campo, direcao] = this.ordenacao.split(',');
        this.atendimentos.sort((a, b) => {
            const valA = new Date(a.dataHoraAtendimento).getTime();
            const valB = new Date(b.dataHoraAtendimento).getTime();
            if (direcao === 'asc') {
                return valA - valB;
            } else {
                return valB - valA;
            }
        });
    }

    irParaPagina(pagina: number): void {
        if (pagina >= 0 && pagina < this.totalPages) {
            this.carregarAtendimentos(pagina);
        }
    }

    voltar(): void {
        this.router.navigate(['/agendamento']);
    }

    editar(atendimentoId: number): void {
        this.router.navigate(['/form-atendimento'], { queryParams: { id: atendimentoId } });
    }

    excluir(atendimentoId: number): void {
        if (window.confirm('Tem certeza que deseja excluir este atendimento?')) {
            this.atendimentoService.delete(atendimentoId).subscribe({
                next: () => {
                    alert('Atendimento excluído com sucesso!');
                    this.carregarAtendimentos(this.page);
                },
                error: (err) => {
                    console.error('Erro ao excluir atendimento:', err);
                    alert('Erro ao excluir atendimento.');
                }
            });
        }
    }
}