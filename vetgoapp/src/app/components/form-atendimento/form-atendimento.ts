import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ICrudForm } from '../i-crud-form';
import { Atendimento } from '../../models/atendimento';
import { AtendimentoService } from '../../services/atendimento';
import { PacienteService } from '../../services/paciente';
import { ProfissionalService } from '../../services/profissional';
import { ResponsavelService } from '../../services/responsavel';
import { Paciente } from '../../models/paciente';
import { Responsavel } from '../../models/responsavel';
import { Profissional } from '../../models/profissional';

@Component({
  selector: 'app-form-atendimento',
  imports: [FormsModule, CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './form-atendimento.html',
  styleUrl: './form-atendimento.scss'
})
export class FormAtendimentoComponent implements ICrudForm<Atendimento> {

  save(): void {
    throw new Error('Method not implemented.');
  }
  constructor(
    private servico: AtendimentoService,
    private servicoPaciente: PacienteService,
    private servicoResponsavel: ResponsavelService,
    private servicoProfissional: ProfissionalService,
    private router: Router,
    private rota: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.rota.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.servico.getById(id).subscribe(registro => {
          this.registro = registro;
        });
      }
    });
  }
    registro: Atendimento = <Atendimento>{};
  pacientes: Paciente[] = [];
  responsaveis: Responsavel[] = [];
  profissionais: Profissional[] = [];
  hoje: string = (new Date()).toISOString().split('T')[0];


}
