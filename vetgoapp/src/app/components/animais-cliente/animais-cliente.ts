import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { switchMap } from 'rxjs/operators';
import { forkJoin, of, Observable } from 'rxjs';

import { Responsavel } from '../../models/responsavel';
import { Paciente } from '../../models/paciente';
import { Atendimento } from '../../models/atendimento';
import { Usuario } from '../../models/usuario';

import { ResponsavelService } from '../../services/responsavel';
import { PacienteService } from '../../services/paciente';
import { AtendimentoService } from '../../services/atendimento';
import { AuthService } from '../../services/AuthService';

@Component({
  standalone: true,
  selector: 'app-animais-cliente',
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, DatePipe],
  templateUrl: './animais-cliente.html',
  styleUrls: ['./animais-cliente.scss']
})
export class AnimaisCliente implements OnInit {
  responsavel: Responsavel = {} as Responsavel;
  pacientes: Paciente[] = [];
  atendimentosPorPaciente: { [key: number]: Atendimento[] } = {};
  usuarioLogado: Usuario | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private responsavelService: ResponsavelService,
    private pacienteService: PacienteService,
    private atendimentoService: AtendimentoService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) return;
    const id = +idParam;

    this.authService.currentUser.subscribe(user => {
      this.usuarioLogado = user;

      let responsavel$: Observable<Responsavel>;

      if (this.usuarioLogado?.papel === 'ROLE_RESPONSAVEL') {
        responsavel$ = this.responsavelService.getByUsuarioId(id);
      } else {
        responsavel$ = this.responsavelService.getById(id);
      }

      responsavel$.pipe(
        switchMap((responsavel: Responsavel) => {
          this.responsavel = responsavel;
          if (!responsavel || !responsavel.id) {
            return of([]);
          }
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
            const pacienteId = this.pacientes[index]?.id;
            if (pacienteId) {
              this.atendimentosPorPaciente[pacienteId] = atendimentos;
            }
          });
        },
        error: (erro) => console.error('Erro ao carregar dados da página de animais:', erro)
      });
    });
  }

  cadastrarAtendimento(paciente: Paciente): void {
    this.router.navigate(['/form-atendimento'], {
      queryParams: {
        responsavelId: this.responsavel.id,
        pacienteId: paciente.id
      }
    });
  }

  getAtendimentosDePaciente(pacienteId: number): Atendimento[] {
    return this.atendimentosPorPaciente[pacienteId] || [];
  }

  editarPaciente(pacienteId: number): void {
    this.router.navigate(['/form-pet'], { queryParams: { id: pacienteId, responsavelId: this.responsavel.id } });
  }

  cadastrarPet(): void {
    this.router.navigate(['/form-pet'], { queryParams: { responsavelId: this.responsavel.id } });
  }

  situacaoPaciente(paciente: Paciente): string {
    return paciente.situacao === 'VIVO' ? 'Vivo' : 'Morto';
  }

  toggleSituacao(paciente: Paciente): void {
    const novaSituacao = paciente.situacao === 'VIVO' ? 'MORTO' : 'VIVO';
    // CORREÇÃO: Garante que a propriedade 'situacao' tenha o tipo correto
    const pacienteAtualizado = { ...paciente, situacao: novaSituacao as 'VIVO' | 'MORTO' };

    this.pacienteService.save(pacienteAtualizado).subscribe({
      next: (pacienteSalvo) => {
        paciente.situacao = pacienteSalvo.situacao;
      },
      error: (err) => console.error('Erro ao atualizar situação:', err)
    });
  }

  podeExcluir(paciente: Paciente): boolean {
    return this.usuarioLogado?.papel !== 'ROLE_RESPONSAVEL' && paciente.situacao === 'MORTO';
  }

  excluirPaciente(pacienteId: number): void {
    const paciente = this.pacientes.find(p => p.id === pacienteId);
    if (!paciente) return;

    if (this.podeExcluir(paciente)) {
      if (confirm(`Tem certeza que deseja excluir o paciente ${paciente.nome}?`)) {
        this.pacienteService.delete(paciente.id).subscribe({
          next: () => {
            this.pacientes = this.pacientes.filter(p => p.id !== paciente.id);
          },
          error: (erro) => console.error('Erro ao excluir o paciente:', erro)
        });
      }
    }
  }
}