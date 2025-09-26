// src/app/components/animais-cliente/animais-cliente.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // [ADICIONADO]
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

interface PacienteComAtendimentos extends Paciente {
  atendimentos: Atendimento[];
}

@Component({
  standalone: true,
  selector: 'app-animais-cliente',
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, DatePipe], // [ATUALIZADO]
  templateUrl: './animais-cliente.html',
  styleUrls: ['./animais-cliente.scss']
})
export class AnimaisCliente implements OnInit {
  responsavel: Responsavel = {} as Responsavel;
  
  pacientes: PacienteComAtendimentos[] = []; // [NOVO] Lista completa de pets
  pacientesFiltrados: PacienteComAtendimentos[] = []; // [NOVO] Lista para o template

  usuarioLogado: Usuario | null = null;
  termoBuscaPet: string = ''; // [NOVO CAMPO] Termo de busca

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private responsavelService: ResponsavelService,
    private pacienteService: PacienteService,
    private atendimentoService: AtendimentoService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.usuarioLogado = user;
      this.carregarDados();
    });
  }
  
  carregarDados(): void { // [NOVO MÉTODO] Extraído a lógica de carregamento
      const idParam = this.route.snapshot.paramMap.get('id');
      const id = this.usuarioLogado?.papel === 'ROLE_RESPONSAVEL' ? this.usuarioLogado.id : (idParam ? +idParam : null);
      
      if (!id) return;

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
          if (pacientes.length === 0) {
            return of([]);
          }
          const todosOsObservables = pacientes.map(paciente =>
            this.atendimentoService.getByPacienteId(paciente.id).pipe(
              switchMap(atendimentos => {
                return of({ ...paciente, atendimentos: atendimentos } as PacienteComAtendimentos);
              })
            )
          );
          return forkJoin(todosOsObservables);
        })
      ).subscribe({
        next: (pacientesComAtendimentos) => {
          this.pacientes = pacientesComAtendimentos;
          this.pacientesFiltrados = [...this.pacientes]; // Inicializa a lista filtrada
        },
        error: (erro) => console.error('Erro ao carregar dados da página de animais:', erro)
      });
  }

  // [NOVO MÉTODO] Implementa a busca
  buscarPet(termo: string): void {
      const termoLowerCase = termo.trim().toLowerCase();
      if (!termoLowerCase) {
          this.pacientesFiltrados = [...this.pacientes];
          return;
      }

      this.pacientesFiltrados = this.pacientes.filter(paciente => 
          paciente.nome.toLowerCase().includes(termoLowerCase) ||
          paciente.raca.toLowerCase().includes(termoLowerCase) ||
          paciente.especie.toLowerCase().includes(termoLowerCase)
      );
  }

  cadastrarAtendimento(paciente: Paciente): void {
    this.router.navigate(['/form-atendimento'], {
      queryParams: {
        responsavelId: this.responsavel.id,
        pacienteId: paciente.id
      }
    });
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
            this.carregarDados(); // Recarrega os dados após exclusão
          },
          error: (erro) => console.error('Erro ao excluir o paciente:', erro)
        });
      }
    }
  }
}