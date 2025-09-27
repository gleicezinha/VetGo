// src/app/components/list-atendimento/list-atendimento.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AtendimentoService } from '../../services/atendimento';
import { AtendimentoResponseDTO } from '../../models/atendimento-response.dto';
import { AuthService } from '../../services/AuthService';
import { ResponsavelService } from '../../services/responsavel';
import { PacienteService } from '../../services/paciente';
import { forkJoin, of, switchMap, Observable } from 'rxjs'; // [MOD] Adicionado Observable
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Page } from '../../models/page.model'; // [NOVO IMPORT]

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
    termoBusca: string = '';
    atendimentosFiltrados: AtendimentoResponseDTO[] = [];

    // [NOVO] Estado de paginação
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

    // [MOD] Aceita termo de busca e página (com valor padrão)
    carregarAtendimentos(termo?: string, page: number = this.page): void {
        this.page = page;
        const user = this.authService.currentUserValue;

        if (user && user.papel === 'ROLE_RESPONSAVEL') {
            // Se for responsável, mantém a lógica de carregar tudo e aplicar o filtro local.
            this.carregarAtendimentosResponsavel(termo);
            this.totalPages = 0; // Desabilita a paginação visual para o Responsável
        } else {
            // Para Admin/Profissional, usa o endpoint geral com busca e paginação
            this.atendimentoService.getAll(termo, this.page, this.size).subscribe({
                next: (pageResponse: Page<AtendimentoResponseDTO>) => {
                    this.atendimentos = pageResponse.content;
                    this.atendimentosFiltrados = pageResponse.content;
                    this.totalPages = pageResponse.totalPages;
                    this.totalElements = pageResponse.totalElements;
                    this.cdr.detectChanges();
                },
                error: (err) => {
                    console.error('Erro ao carregar todos os atendimentos:', err);
                }
            });
        }
    }
    
    // [NOVO MÉTODO] Mantém a lógica de carregamento completo para o Responsável
    carregarAtendimentosResponsavel(termo?: string): void {
        const user = this.authService.currentUserValue;
        if (!user) return;
        
        this.responsavelService.getByUsuarioId(user.id).pipe(
                switchMap(responsavel => {
                    if (!responsavel || !responsavel.id) {
                        return of([]);
                    }
                    return this.pacienteService.getByResponsavelId(responsavel.id);
                }),
                switchMap(pacientes => {
                    if (pacientes.length === 0) {
                        return of([]);
                    }
                    const atendimentoCalls: Observable<AtendimentoResponseDTO[]>[] = pacientes.map(paciente =>
                        this.atendimentoService.getAtendimentosByResponsavelId(paciente.id) 
                    );
                    return forkJoin(atendimentoCalls);
                })
            ).subscribe({
                next: (atendimentosPorPaciente) => {
                    const todosAtendimentos = atendimentosPorPaciente.flat().map(atendimento => {
                        return {
                            id: atendimento.id,
                            dataHoraAtendimento: atendimento.dataHoraAtendimento,
                            status: atendimento.status,
                            tipoDeAtendimento: atendimento.tipoDeAtendimento,
                            nomePaciente: atendimento.nomePaciente || 'N/A',
                            nomeResponsavel: atendimento.nomeResponsavel || 'N/A',
                            nomeProfissional: atendimento.nomeProfissional || 'N/A',
                            responsavelId: atendimento.responsavelId || 0,
                        } as AtendimentoResponseDTO;
                    });
                    this.atendimentos = todosAtendimentos;
                    this.aplicarFiltroLocal(termo); 
                },
                error: (err) => {
                    console.error('Erro ao carregar atendimentos do responsável:', err);
                }
            });
    }


    // [MÉTODO EXISTENTE] Lógica de filtro local (usado pelo ROLE_RESPONSAVEL)
    aplicarFiltroLocal(termo?: string): void { 
        if (!termo || termo.trim() === '') {
            this.atendimentosFiltrados = [...this.atendimentos];
            this.cdr.detectChanges();
            return;
        }

        const termoLowerCase = termo.trim().toLowerCase();
        this.atendimentosFiltrados = this.atendimentos.filter(atd => {
            // Filtra por Paciente, Tipo, Profissional, Responsável e Status
            const fields = [atd.nomePaciente, atd.tipoDeAtendimento, atd.nomeProfissional, atd.nomeResponsavel, atd.status]
                .map(f => f?.toLowerCase() || '');
            
            return fields.some(field => field.includes(termoLowerCase));
        });
        this.cdr.detectChanges();
    }
    
    // [MOD] Aciona a busca/paginação
    buscarComTermo(termoBusca: string): void { 
        const termo = termoBusca.trim();
        if (this.userRole === 'ROLE_RESPONSAVEL') {
            this.aplicarFiltroLocal(termo);
        } else {
            // Ao buscar, reinicia para a primeira página
            this.page = 0;
            this.carregarAtendimentos(termo, this.page);
        }
    }
    
    // [NOVO MÉTODO] Lógica de paginação
    irParaPagina(pagina: number): void {
        if (pagina >= 0 && pagina < this.totalPages) {
            this.carregarAtendimentos(this.termoBusca, pagina);
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
                    // Após a exclusão, recarrega a página atual
                    this.carregarAtendimentos(this.termoBusca, this.page);
                },
                error: (err) => {
                    console.error('Erro ao excluir atendimento:', err);
                    alert('Erro ao excluir atendimento. Verifique o console.');
                }
            });
        }
    }
}