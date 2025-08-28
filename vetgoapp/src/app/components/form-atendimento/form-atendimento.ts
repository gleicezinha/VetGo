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

  registro: Atendimento = {} as Atendimento;
  tiposDeAtendimento = Object.values(EAtendimento);
  
  responsaveis: Responsavel[] = [];
  pacientesDoResponsavel: Paciente[] = [];
  profissionais: Profissional[] = [];

  // Variáveis para controlar os IDs selecionados
  responsavelIdSelecionado?: number;
  pacienteIdSelecionado?: number;
  
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

    // Carrega sempre os profissionais
    this.carregarProfissionais();

    if (responsavelIdParam && pacienteIdParam) {
      // Se vier da página de animais, pré-seleciona
      this.responsavelIdSelecionado = +responsavelIdParam;
      this.pacienteIdSelecionado = +pacienteIdParam;
      
      // Carrega tanto o responsável quanto os seus pets
      forkJoin({
        responsavel: this.responsavelService.getById(this.responsavelIdSelecionado),
        pacientes: this.pacienteService.getByResponsavelId(this.responsavelIdSelecionado)
      }).subscribe(({responsavel, pacientes}) => {
        this.responsaveis = [responsavel]; // Coloca apenas o responsável relevante na lista
        this.pacientesDoResponsavel = pacientes;
      });

    } else {
      // Senão, carrega todos os responsáveis para o dropdown
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

  // Quando o usuário muda o responsável no dropdown
  onResponsavelChange(responsavelId: number): void {
    this.responsavelIdSelecionado = responsavelId;
    this.pacienteIdSelecionado = undefined; // Limpa a seleção de pet
    this.pacientesDoResponsavel = []; // Limpa a lista de pets

    if (responsavelId) {
      this.pacienteService.getByResponsavelId(responsavelId).subscribe(data => {
        this.pacientesDoResponsavel = data;
      });
    }
  }
  
  save(): void {
    // Monta o objeto de atendimento com os IDs antes de salvar
    this.registro.paciente = this.pacientesDoResponsavel.find(p => p.id === this.pacienteIdSelecionado);
    this.registro.responsavel = this.responsaveis.find(r => r.id === this.responsavelIdSelecionado);

    this.servico.save(this.registro).subscribe({
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