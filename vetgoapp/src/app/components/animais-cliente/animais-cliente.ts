import { Component, OnInit } from '@angular/core';
import { Responsavel } from '../../models/responsavel';
import { Paciente } from '../../models/paciente';
import { Atendimento } from '../../models/atendimento';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ResponsavelService } from '../../services/responsavel';
import { PacienteService } from '../../services/paciente';
import { AtendimentoService } from '../../services/atendimento';
import { switchMap } from 'rxjs/operators';
import { forkJoin, of, Observable } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-animais-cliente',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './animais-cliente.html',
  styleUrls: ['./animais-cliente.scss']
})
export class AnimaisCliente implements OnInit {

  responsavel: Responsavel = {} as Responsavel;
  pacientes: Paciente[] = [];
  atendimentosPorPaciente: { [key: number]: Atendimento[] } = {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private responsavelService: ResponsavelService,
    private pacienteService: PacienteService,
    private atendimentoService: AtendimentoService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.queryParamMap.get('id');

    if (id) {
      this.responsavelService.getById(+id).pipe(
        switchMap((responsavel: Responsavel) => {
          this.responsavel = responsavel;
          if (responsavel.id) {
            return this.pacienteService.getByResponsavelId(responsavel.id);
          } else {
            return of([]);
          }
        }),
        switchMap((pacientes: Paciente[]) => {
          this.pacientes = pacientes;
          if (pacientes.length === 0) {
            return of(null);
          }
          
          const atendimentos$: Observable<Atendimento[]>[] = pacientes.map(paciente => {
            if (paciente.id) {
              return this.atendimentoService.getByPacienteId(paciente.id);
            }
            return of([]);
          });

          return forkJoin(atendimentos$).pipe(
            switchMap((listasAtendimentos: Atendimento[][]) => {
                listasAtendimentos.forEach((atendimentos, index) => {
                    const pacienteId = pacientes[index].id;
                    if (pacienteId) {
                        this.atendimentosPorPaciente[pacienteId] = atendimentos;
                    }
                });
                return of(null);
            })
          );
        })
      ).subscribe({
        next: () => {
          console.log('Dados do responsável, pacientes e atendimentos carregados com sucesso.');
          console.log('Atendimentos por paciente:', this.atendimentosPorPaciente);
        },
        error: (erro) => {
          console.error('Erro no fluxo de carregamento de dados:', erro);
        },
      });
    }
  }

  getAtendimentosDePaciente(pacienteId: number): Atendimento[] {
    return this.atendimentosPorPaciente[pacienteId] || [];
  }
}