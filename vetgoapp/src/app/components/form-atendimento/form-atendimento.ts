import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router'; // Adicionado RouterLink
import { Atendimento } from '../../models/atendimento';
import { AtendimentoService } from '../../services/atendimento';
import { PacienteService } from '../../services/paciente';
import { ProfissionalService } from '../../services/profissional';
import { ResponsavelService } from '../../services/responsavel';
import { Paciente } from '../../models/paciente';
import { Responsavel } from '../../models/responsavel';
import { Profissional } from '../../models/profissional';
import { EAtendimento } from '../../models/eatendimento.model';

@Component({
  selector: 'app-form-atendimento',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink], // Adicionado RouterLink
  templateUrl: './form-atendimento.html',
  styleUrls: ['./form-atendimento.scss']
})
export class FormAtendimentoComponent implements OnInit {

  registro: Atendimento = <Atendimento>{};
  tiposDeAtendimento = Object.values(EAtendimento);
  
  responsaveis: Responsavel[] = [];
  pacientesDoResponsavel: Paciente[] = [];
  profissionais: Profissional[] = [];

  responsavelSelecionado?: Responsavel;
  pacienteSelecionado?: Paciente;
  
  constructor(
    private servico: AtendimentoService,
    private responsavelService: ResponsavelService,
    private pacienteService: PacienteService,
    private profissionalService: ProfissionalService,
    private router: Router,
    public route: ActivatedRoute // Modificado para public
  ) {}

  ngOnInit(): void {
    this.carregarProfissionais();

    const responsavelId = this.route.snapshot.queryParamMap.get('responsavelId');
    const pacienteId = this.route.snapshot.queryParamMap.get('pacienteId');

    if (responsavelId && pacienteId) {
      this.responsavelService.getById(+responsavelId).subscribe(resp => {
        this.responsavelSelecionado = resp;
        this.registro.responsavel = resp;
        this.carregarPacientesDoResponsavel(+responsavelId);
        this.pacienteService.getById(+pacienteId).subscribe(pac => {
          this.pacienteSelecionado = pac;
          this.registro.paciente = pac;
        });
      });
    } else {
      this.carregarResponsaveis();
    }
  }

  // Função de comparação para Responsáveis
  compararResponsaveis(r1: Responsavel, r2: Responsavel): boolean {
    return r1 && r2 ? r1.id === r2.id : r1 === r2;
  }

  // Função de comparação para Pacientes
  compararPacientes(p1: Paciente, p2: Paciente): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }

  carregarResponsaveis(): void {
    this.responsavelService.get().subscribe(data => {
      this.responsaveis = data;
    });
  }

  carregarPacientesDoResponsavel(responsavelId: number): void {
    this.pacienteService.getByResponsavelId(responsavelId).subscribe(data => {
      this.pacientesDoResponsavel = data;
    });
  }
  
  carregarProfissionais(): void {
    this.profissionalService.get().subscribe(data => {
      this.profissionais = data;
    });
  }

  onResponsavelChange(responsavel: Responsavel): void {
    this.responsavelSelecionado = responsavel;
    this.registro.responsavel = responsavel;
    this.pacientesDoResponsavel = [];
    this.pacienteSelecionado = undefined;
    this.registro.paciente = undefined;
    if (responsavel && responsavel.id) {
      this.carregarPacientesDoResponsavel(responsavel.id);
    }
  }

  onPacienteChange(paciente: Paciente): void {
    this.pacienteSelecionado = paciente;
    this.registro.paciente = paciente;
  }
  
  save(): void {
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