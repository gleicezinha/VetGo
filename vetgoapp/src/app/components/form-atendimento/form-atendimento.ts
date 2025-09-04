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

  // ✅ CORRIGIDO: Todos os campos do formulário agora vivem em um único objeto.
  registro = {
    responsavelId: undefined as number | undefined,
    pacienteId: undefined as number | undefined,
    profissionalId: undefined as number | undefined,
    dataHoraAtendimento: '',
    tipoDeAtendimento: EAtendimento.CONSULTA,
    observacao: ''
  };

  // Listas de dados para os selects
  tiposDeAtendimento = Object.values(EAtendimento);
  responsaveis: Responsavel[] = [];
  pacientesDoResponsavel: Paciente[] = [];
  profissionais: Profissional[] = [];

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
      this.registro.dataHoraAtendimento = dataHoraParam;
    }

    this.carregarProfissionais();

    if (responsavelIdParam && pacienteIdParam) {
      this.registro.responsavelId = +responsavelIdParam;
      this.registro.pacienteId = +pacienteIdParam;

      forkJoin({
        responsavel: this.responsavelService.getById(this.registro.responsavelId),
        pacientes: this.pacienteService.getByResponsavelId(this.registro.responsavelId)
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
    this.registro.pacienteId = undefined;
    this.pacientesDoResponsavel = [];

    if (responsavelId) {
      this.pacienteService.getByResponsavelId(responsavelId).subscribe(data => {
        this.pacientesDoResponsavel = data;
      });
    }
  }

  // ✅ CORRIGIDO: A função save agora é muito mais simples e segura.
  save(): void {
    const responsavelSelecionado = this.responsaveis.find(r => r.id === this.registro.responsavelId);
    const pacienteSelecionado = this.pacientesDoResponsavel.find(p => p.id === this.registro.pacienteId);
    const profissionalSelecionado = this.profissionais.find(p => p.id === this.registro.profissionalId);
    console.log('Registro:', this.registro);
    console.log('Responsável selecionado:', responsavelSelecionado);
    console.log('Paciente selecionado:', pacienteSelecionado);
    console.log('Profissional selecionado:', profissionalSelecionado);
    if (!responsavelSelecionado || !pacienteSelecionado || !profissionalSelecionado) {
      alert('Dados incompletos. Verifique o formulário.');
      return;
    }

    const atendimentoFinal: Atendimento = {
      dataHoraAtendimento: this.registro.dataHoraAtendimento,
      tipoDeAtendimento: this.registro.tipoDeAtendimento,
      observacao: this.registro.observacao,
      status: 'AGENDADO',
      paciente: pacienteSelecionado,
      responsavel: responsavelSelecionado,
      profissional: profissionalSelecionado
    };

    this.servico.save(atendimentoFinal).subscribe({
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