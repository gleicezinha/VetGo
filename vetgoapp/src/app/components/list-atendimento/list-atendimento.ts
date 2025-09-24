// src/app/components/list-atendimento/list-atendimento.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AtendimentoService } from '../../services/atendimento';
import { AtendimentoResponseDTO } from '../../models/atendimento-response.dto';
import { AuthService } from '../../services/AuthService';
import { ResponsavelService } from '../../services/responsavel';
import { PacienteService } from '../../services/paciente';
import { forkJoin, of, switchMap } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-list-atendimento',
    standalone: true,
    imports: [CommonModule, DatePipe, RouterModule, MatMenuModule, MatButtonModule],
    templateUrl: './list-atendimento.html',
    styleUrls: ['./list-atendimento.scss']
})
export class ListAtendimentoComponent implements OnInit {

    atendimentos: AtendimentoResponseDTO[] = [];
    userRole: string | null = null;

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

    carregarAtendimentos(): void {
        const user = this.authService.currentUserValue;
        if (user && user.papel === 'ROLE_RESPONSAVEL') {
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
                    const atendimentoCalls = pacientes.map(paciente =>
                        this.atendimentoService.getByPacienteId(paciente.id)
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
                            nomePaciente: atendimento.paciente?.nome || 'N/A',
                            nomeResponsavel: atendimento.paciente?.responsavel?.usuario?.nomeUsuario || 'N/A',
                            nomeProfissional: atendimento.profissional?.usuario?.nomeUsuario || 'N/A',
                            // CORREÇÃO: Mapeia o ID do responsável
                            responsavelId: atendimento.paciente?.responsavel?.id || 0,
                        } as AtendimentoResponseDTO;
                    });
                    this.atendimentos = todosAtendimentos;
                    this.cdr.detectChanges();
                },
                error: (err) => {
                    console.error('Erro ao carregar atendimentos do responsável:', err);
                }
            });
        } else {
            this.atendimentoService.getAll().subscribe({
                next: (dados) => {
                    this.atendimentos = dados;
                    this.cdr.detectChanges();
                },
                error: (err) => {
                    console.error('Erro ao carregar todos os atendimentos:', err);
                }
            });
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
                    this.carregarAtendimentos();
                },
                error: (err) => {
                    console.error('Erro ao excluir atendimento:', err);
                    alert('Erro ao excluir atendimento. Verifique o console.');
                }
            });
        }
    }
}