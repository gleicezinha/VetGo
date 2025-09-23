import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Atendimento } from '../../models/atendimento';
import { AtendimentoService } from '../../services/atendimento';
import { PacienteService } from '../../services/paciente';
import { ProfissionalService } from '../../services/profissional';
import { ResponsavelService } from '../../services/responsavel';
import { Paciente } from '../../models/paciente';
import { Responsavel } from '../../models/responsavel';
import { Profissional } from '../../models/profissional';
import { EAtendimento } from '../../models/eatendimento.model';
import { forkJoin, of, Observable } from 'rxjs';
import { AuthService } from '../../services/AuthService';
import { switchMap } from 'rxjs/operators';
import { Procedimento } from '../../models/procedimento';
import { ProcedimentoService } from '../../services/procedimento';

@Component({
  selector: 'app-form-atendimento',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './form-atendimento.html',
  styleUrls: ['./form-atendimento.scss']
})
export class FormAtendimentoComponent implements OnInit {

  registro = {
    id: undefined as number | undefined,
    responsavelId: undefined as number | undefined,
    pacienteId: undefined as number | undefined,
    profissionalId: undefined as number | undefined,
    dataHoraAtendimento: '',
    tipoDeAtendimento: EAtendimento.CONSULTA,
    observacao: '',
    status: undefined as string | undefined
  };

  procedimento: Procedimento = {} as Procedimento;

  tiposDeAtendimento = Object.values(EAtendimento);
  responsaveis: Responsavel[] = [];
  pacientesDoResponsavel: Paciente[] = [];
  profissionais: Profissional[] = [];
  isResponsavel = false;
  statusAtendimento = ['AGENDADO', 'CONFIRMADO', 'CHEGADA', 'ATENDIMENTO', 'ENCERRADO', 'CANCELADO'];
  userRole: string | null = null;
  isEditMode = false;

  constructor(
    private servico: AtendimentoService,
    private responsavelService: ResponsavelService,
    private pacienteService: PacienteService,
    private profissionalService: ProfissionalService,
    private procedimentoService: ProcedimentoService,
    private authService: AuthService,
    private router: Router,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const atendimentoIdParam = this.route.snapshot.queryParamMap.get('id');
    this.isEditMode = !!atendimentoIdParam;

    this.authService.currentUser.subscribe(user => {
      this.userRole = user?.papel ?? null;
    });

    forkJoin({
      responsaveis: this.responsavelService.get(),
      profissionais: this.profissionalService.get(),
    }).subscribe(data => {
      this.responsaveis = data.responsaveis;
      this.profissionais = data.profissionais;

      if (this.isEditMode && atendimentoIdParam) {
        this.servico.getById(+atendimentoIdParam).subscribe(atendimento => {
          if (atendimento) {
            this.registro.id = atendimento.id;
            this.registro.dataHoraAtendimento = atendimento.dataHoraAtendimento;
            this.registro.tipoDeAtendimento = atendimento.tipoDeAtendimento as EAtendimento;
            this.registro.observacao = atendimento.observacao ?? '';
            this.registro.status = atendimento.status;
            this.registro.profissionalId = atendimento.profissional?.id;

            const responsavelId = atendimento.paciente?.responsavel?.id;
            const pacienteId = atendimento.paciente?.id;

            if (responsavelId && pacienteId) {
              this.onResponsavelChange(responsavelId, pacienteId);
              this.registro.responsavelId = responsavelId;
            }
          }
        });
      } else {
        const dataHoraParam = this.route.snapshot.queryParamMap.get('dataHora');
        const responsavelIdParam = this.route.snapshot.queryParamMap.get('responsavelId');
        const pacienteIdParam = this.route.snapshot.queryParamMap.get('pacienteId');

        if (dataHoraParam) {
          this.registro.dataHoraAtendimento = dataHoraParam;
        }

        const user = this.authService.currentUserValue;
        if (user && user.papel === 'ROLE_RESPONSAVEL') {
          this.isResponsavel = true;
          this.responsavelService.getByUsuarioId(user.id).pipe(
            switchMap((responsavel: Responsavel) => {
              this.responsaveis = [responsavel];
              this.registro.responsavelId = responsavel.id;
              return this.pacienteService.getByResponsavelId(responsavel.id);
            })
          ).subscribe(pacientes => {
            this.pacientesDoResponsavel = pacientes;
            if (pacienteIdParam) {
              this.registro.pacienteId = +pacienteIdParam;
            }
          });
        } else {
          if (responsavelIdParam && pacienteIdParam) {
            this.registro.responsavelId = +responsavelIdParam;
            this.onResponsavelChange(+responsavelIdParam, +pacienteIdParam);
          }
        }
      }
    });
  }

  onResponsavelChange(responsavelId: number, pacienteIdToSelect?: number): void {
    if (!pacienteIdToSelect) {
      this.registro.pacienteId = undefined;
    }
    this.pacientesDoResponsavel = [];

    if (responsavelId) {
      this.pacienteService.getByResponsavelId(responsavelId).subscribe(data => {
        this.pacientesDoResponsavel = data;
        if (pacienteIdToSelect) {
          this.registro.pacienteId = pacienteIdToSelect;
        }
      });
    }
  }

  save(): void {
    const responsavelSelecionado = this.responsaveis.find(r => r.id === this.registro.responsavelId);
    const pacienteSelecionado = this.pacientesDoResponsavel.find(p => p.id === this.registro.pacienteId);
    const profissionalSelecionado = this.profissionais.find(p => p.id === this.registro.profissionalId);
    if (!responsavelSelecionado || !pacienteSelecionado || !profissionalSelecionado) {
      alert('Dados incompletos. Verifique o formulário.');
      return;
    }

    let atendimentoFinal: Atendimento = {
      id: this.registro.id,
      dataHoraAtendimento: this.registro.dataHoraAtendimento,
      tipoDeAtendimento: this.registro.tipoDeAtendimento,
      observacao: this.registro.observacao,
      paciente: pacienteSelecionado,
      responsavel: responsavelSelecionado,
      profissional: profissionalSelecionado
    };

    if (!this.registro.id) {
      atendimentoFinal.status = 'AGENDADO';
    } else if (this.registro.status) {
      atendimentoFinal.status = this.registro.status;
    }

    this.servico.save(atendimentoFinal).subscribe({
      next: (atendimentoSalvo) => {
        if (this.registro.tipoDeAtendimento === 'VACINACAO' && atendimentoSalvo.id) {
          this.procedimento.atendimento = atendimentoSalvo;
          this.procedimento.paciente = pacienteSelecionado;
          this.procedimento.tipo = EAtendimento.VACINACAO;

          // **ESTA É A LINHA QUE FOI ADICIONADA**
          this.procedimento.dataAtendimento = atendimentoSalvo.dataHoraAtendimento.split('T')[0];

          this.procedimentoService.save(this.procedimento).subscribe({
            complete: () => {
              alert('Atendimento e vacina salvos com sucesso!');
              this.router.navigate(['/list-atendimento']);
            },
            error: (err) => {
              console.error('Erro ao salvar o procedimento:', err);
              alert('Erro ao salvar a vacina. Verifique o console para mais detalhes.');
            }
          });
        } else {
          alert('Atendimento salvo com sucesso!');
          this.router.navigate(['/list-atendimento']);
        }
      },
      error: (err) => {
        console.error('Erro ao salvar o atendimento:', err);
        alert('Erro ao salvar o atendimento. Verifique o console para mais detalhes.');
      }
    });
  }

  carregarResponsaveis(): void {
    this.responsavelService.get().subscribe(data => {
      this.responsaveis = data;
    });
  }

  carregarProfissionais(): void {
    this.profissionalService.get().subscribe(data => {
      this.profissionais = data;
    });
  }
}