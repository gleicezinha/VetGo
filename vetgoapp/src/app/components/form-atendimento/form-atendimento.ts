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
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-form-atendimento',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './form-atendimento.html',
  styleUrls: ['./form-atendimento.scss']
})
export class FormAtendimentoComponent implements OnInit {

  // Objeto para os campos que não são de seleção
  registroParcial = {
    dataHoraAtendimento: '',
    tipoDeAtendimento: EAtendimento.CONSULTA,
    observacao: ''
  };

  tiposDeAtendimento = Object.values(EAtendimento);

  // Listas para popular os selects
  responsaveis: Responsavel[] = [];
  pacientesDoResponsavel: Paciente[] = [];
  profissionais: Profissional[] = [];

  // IDs para controlar os valores selecionados nos selects
  responsavelIdSelecionado?: number;
  pacienteIdSelecionado?: number;
  profissionalIdSelecionado?: number;

  constructor(
    private servico: AtendimentoService,
    private responsavelService: ResponsavelService,
    private pacienteService: PacienteService,
    private profissionalService: ProfissionalService,
    private router: Router,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const responsavelIdParam = this.route.snapshot.queryParamMap.get('responsavelId');
    const pacienteIdParam = this.route.snapshot.queryParamMap.get('pacienteId');
    const dataHoraParam = this.route.snapshot.queryParamMap.get('dataHora');

    if (dataHoraParam) {
      this.registroParcial.dataHoraAtendimento = dataHoraParam;
    }

    this.carregarProfissionais();

    if (responsavelIdParam && pacienteIdParam) {
      this.responsavelIdSelecionado = +responsavelIdParam;
      this.pacienteIdSelecionado = +pacienteIdParam;

      forkJoin({
        responsavel: this.responsavelService.getById(this.responsavelIdSelecionado),
        pacientes: this.pacienteService.getByResponsavelId(this.responsavelIdSelecionado)
      }).subscribe(({responsavel, pacientes}) => {
        this.responsaveis = [responsavel];
        this.pacientesDoResponsavel = pacientes;
      });

    } else {
      this.carregarResponsaveis();
    }
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

  onResponsavelChange(responsavelId: number): void {
    this.responsavelIdSelecionado = responsavelId;
    this.pacienteIdSelecionado = undefined;
    this.pacientesDoResponsavel = [];

    if (responsavelId) {
      this.pacienteService.getByResponsavelId(responsavelId).subscribe(data => {
        this.pacientesDoResponsavel = data;
      });
    }
  }

  // ✅ CORRIGIDO E MAIS ROBUSTO:
  // A função agora valida os dados e monta o objeto final apenas no momento de salvar.
  save(): void {
    // 1. Validação: Verifica se todos os IDs necessários foram selecionados
    if (!this.responsavelIdSelecionado || !this.pacienteIdSelecionado || !this.profissionalIdSelecionado) {
      alert('Por favor, selecione o responsável, o paciente e o profissional.');
      return; // Interrompe a execução se algo estiver faltando
    }

    // 2. Busca os objetos completos com base nos IDs
    const responsavelSelecionado = this.responsaveis.find(r => r.id === this.responsavelIdSelecionado);
    const pacienteSelecionado = this.pacientesDoResponsavel.find(p => p.id === this.pacienteIdSelecionado);
    const profissionalSelecionado = this.profissionais.find(p => p.id === this.profissionalIdSelecionado);

    // 3. Monta o objeto 'Atendimento' completo
    const atendimentoCompleto: Atendimento = {
      ...this.registroParcial,
      status: 'AGENDADO',
      responsavel: responsavelSelecionado,
      paciente: pacienteSelecionado,
      profissional: profissionalSelecionado!
    };

    // 4. Envia o objeto completo para o serviço
    this.servico.save(atendimentoCompleto).subscribe({
      complete: () => {
        alert('Atendimento salvo com sucesso!');
        this.router.navigate(['/list-cliente']);
      },
      error: (err) => {
        console.error('Erro ao salvar o atendimento:', err);
        alert('Erro ao salvar o atendimento. Verifique o console para mais detalhes.');
      }
    });
  }
}