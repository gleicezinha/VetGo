import { Component, OnInit } from '@angular/core';
import { Responsavel } from '../../models/responsavel';
import { Paciente } from '../../models/paciente';
import { Atendimento } from '../../models/atendimento';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router'; // Removido RouterLink daqui
import { FormsModule } from '@angular/forms';
import { ResponsavelService } from '../../services/responsavel';
import { PacienteService } from '../../services/paciente';
import { AtendimentoService } from '../../services/atendimento';
import { switchMap } from 'rxjs/operators';
import { forkJoin, of, Observable } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-animais-cliente',
  imports: [CommonModule, FormsModule], // Corrigido aqui
  templateUrl: './animais-cliente.html',
  styleUrls: ['./animais-cliente.scss']
})
export class AnimaisCliente implements OnInit {
  // ... o resto da sua classe continua igual ...
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
    const id = this.route.snapshot.paramMap.get('id'); // Use paramMap para rotas como /animais-cliente/:id

    if (id) {
      this.responsavelService.getById(+id).pipe(
        switchMap((responsavel: Responsavel) => {
          this.responsavel = responsavel;
          return this.pacienteService.getByResponsavelId(responsavel.id);
        }),
        switchMap((pacientes: Paciente[]) => {
          this.pacientes = pacientes;
          if (pacientes.length === 0) {
            return of([]);
          }
          const atendimentos$: Observable<Atendimento[]>[] = pacientes.map(p =>
            p.id ? this.atendimentoService.getByPacienteId(p.id) : of([])
          );
          return forkJoin(atendimentos$);
        })
      ).subscribe({
        next: (listasAtendimentos) => {
          listasAtendimentos.forEach((atendimentos, index) => {
            const pacienteId = this.pacientes[index].id;
            if (pacienteId) {
              this.atendimentosPorPaciente[pacienteId] = atendimentos;
            }
          });
        },
        error: (erro) => console.error('Erro ao carregar dados:', erro)
      });
    }
  }

  getAtendimentosDePaciente(pacienteId: number): Atendimento[] {
    return this.atendimentosPorPaciente[pacienteId] || [];
  }
}