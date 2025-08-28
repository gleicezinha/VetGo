import { Component, OnInit } from '@angular/core';
import { Responsavel } from '../../models/responsavel';
import { Paciente } from '../../models/paciente';
import { Atendimento } from '../../models/atendimento';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router'; 
import { FormsModule } from '@angular/forms';
import { ResponsavelService } from '../../services/responsavel';
import { PacienteService } from '../../services/paciente';
import { AtendimentoService } from '../../services/atendimento';
import { switchMap } from 'rxjs/operators';
import { forkJoin, of, Observable } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-animais-cliente',
  imports: [CommonModule, FormsModule],
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
    const id = this.route.snapshot.paramMap.get('id');

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

  // Novo método para navegar para o formulário de atendimento
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
  
  editarPaciente(paciente: Paciente): void {
    this.router.navigate(['/form-pet'], { queryParams: { id: paciente.id, responsavelId: this.responsavel.id } });
  }

  cadastrarPet(): void {
    this.router.navigate(['/form-pet'], { queryParams: { responsavelId: this.responsavel.id } });
  }

  situacaoPaciente(paciente: Paciente): string {
    return paciente.situacao === 'VIVO' ? 'Vivo' : 'Morto';
  }

  toggleSituacao(paciente: Paciente): void {
    if (paciente.situacao === 'VIVO') {
      paciente.situacao = 'MORTO';
    } else {
      paciente.situacao = 'VIVO';
    }
    // Opcional: Chame o serviço para atualizar a situação no backend
    // this.pacienteService.update(paciente).subscribe();
  }

  podeExcluir(paciente: Paciente): boolean {
    return paciente.situacao === 'MORTO';
  }

  excluirPaciente(paciente: Paciente): void {
    if (this.podeExcluir(paciente)) {
      if (confirm(`Tem certeza que deseja excluir o paciente ${paciente.nome}?`)) {
        this.pacienteService.delete(paciente.id).subscribe({
          next: () => {
            console.log('Paciente excluído com sucesso!');
          },
          complete: () => {
            this.pacientes = this.pacientes.filter(p => p.id !== paciente.id);
          },
          error: (erro) => console.error('Erro ao excluir o paciente:', erro)
        });
      }
    }
  }
}