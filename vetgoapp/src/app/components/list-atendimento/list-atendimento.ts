import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AtendimentoService } from '../../services/atendimento';
import { AtendimentoResponseDTO } from '../../models/atendimento-response.dto';
import { AuthService } from '../../services/AuthService';
import { ResponsavelService } from '../../services/responsavel';
import { PacienteService } from '../../services/paciente';
import { forkJoin, of, switchMap } from 'rxjs';

@Component({
    selector: 'app-list-atendimento',
    standalone: true,
    imports: [CommonModule, DatePipe],
    templateUrl: './list-atendimento.html',
    styleUrls: ['./list-atendimento.scss']
})
export class ListAtendimentoComponent implements OnInit {

    atendimentos: AtendimentoResponseDTO[] = [];

    constructor(
        private atendimentoService: AtendimentoService,
        private router: Router,
        private cdr: ChangeDetectorRef,
        private authService: AuthService,
        private responsavelService: ResponsavelService,
        private pacienteService: PacienteService
    ) { }

    ngOnInit(): void {
        this.carregarAtendimentos();
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
}