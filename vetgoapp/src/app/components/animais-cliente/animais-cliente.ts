import { Component, OnInit } from '@angular/core';
import { Responsavel } from '../../models/responsavel';
import { Paciente } from '../../models/paciente';
import { Atendimento } from '../atendimento/atendimento';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ResponsavelService } from '../../services/responsavel';
import { PacienteService } from '../../services/paciente';
import { AtendimentoService } from '../../services/atendimento';
import { flatMap } from 'rxjs/internal/operators/flatMap';

@Component({
  standalone: true,
  selector: 'app-animais-cliente',
  imports: [CommonModule, FormsModule],
  templateUrl: './animais-cliente.html',
  styleUrls: ['./animais-cliente.scss']
})
export class AnimaisCliente implements OnInit {

  // Propriedade para armazenar a lista completa de pacientes
  pacientes: Paciente[] = []; 
  atendimento: Atendimento = <Atendimento>{};
  responsavel: Responsavel = <Responsavel>{};
  
  // A propriedade 'paciente' não é mais necessária para a lista,
  // mas pode ser útil para outras lógicas.
  // paciente: Paciente = <Paciente>{};

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
        flatMap((responsavel: Responsavel) => {
          this.responsavel = responsavel;
          return this.pacienteService.getByResponsavelId(responsavel.id);
        })
      ).subscribe((pacientes: Paciente[]) => {
        // Agora, a lista completa de pacientes é atribuída à propriedade 'pacientes'
        this.pacientes = pacientes;

        // Se a lista não estiver vazia, pegue os atendimentos do primeiro paciente
        if (this.pacientes.length > 0) {
          this.getAtendimentos(this.pacientes[0].id);
        }
      });
    }
  }

  getAtendimentos(pacienteId: number): void {
    this.atendimentoService.getByPacienteId(pacienteId).subscribe({
      next: (resposta: Atendimento) => {
        this.atendimento = resposta;
      },
      error: (erro) => {
        console.error('Erro ao buscar atendimentos:', erro);
      }
    });
  }
}