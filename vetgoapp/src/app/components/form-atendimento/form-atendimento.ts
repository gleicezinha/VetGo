import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
import { EAtendimento } from '../../models/eatendimento.model';

@Component({
  selector: 'app-form-atendimento',
  imports: [FormsModule, CommonModule,  ReactiveFormsModule],
  templateUrl: './form-atendimento.html',
  styleUrl: './form-atendimento.scss'
})
export class FormAtendimentoComponent implements OnInit {


  constructor(
    private servico: AtendimentoService,
    private servicoPaciente: PacienteService,
    private servicoResponsavel: ResponsavelService,
    private servicoProfissional: ProfissionalService,
    private router: Router,
    private rota: ActivatedRoute
  ) {}
  ngOnInit(): void {
    const id = this.rota.snapshot.queryParamMap.get('id');
    if (id) {
      this.servico.getById(+id).subscribe({
        next: (resposta: Atendimento) => {
          this.registro = resposta;
        },
        error: (erro: any) => {
          console.error('Erro ao carregar atendimento:', erro);
        }
    
      })
   
    }
    else{
      this.carregarPacientes();
      this.carregarResponsaveis();
    }

    
  }
  registro: Atendimento = <Atendimento>{};
  tiposDeAtendimento = Object.values(EAtendimento);
  pacientes: Paciente[] = []; 
  responsaveis: Responsavel[] = [];
  profissionais: Profissional[] = [];

  compararTipos(tipo1: any, tipo2: any): boolean {
    return tipo1 && tipo2 ? tipo1 === tipo2 : tipo1 === tipo2;
  }
  
  compararPacientes(p1: Paciente, p2: Paciente): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }
  compararResponsaveis(r1: Responsavel, r2: Responsavel): boolean {
    return r1 && r2 ? r1.id === r2.id : r1 === r2;
  }

  carregarPacientes(): void {
    this.servicoPaciente.get().subscribe({
      next: (res: Paciente[]) => {
        this.pacientes = res;
      }
    });
  }
  carregarResponsaveis(): void {
    this.servicoResponsavel.get().subscribe({
      next: (res: Responsavel[]) => {
        this.responsaveis = res;
      }
    });
  }
  save(): void {
    if (this.registro.id) {
      this.servico.save(this.registro).subscribe({
        complete: () => {
          alert('Prontuário salvo com sucesso!');
          //console.log(this.atendimento.paciente.id)
          //const idPaciente = this.atendimento.paciente.id
          this.router.navigate(['/atendimento'])
        },
      error(err) {
        alert('Erro ao salvar prontuário');
      },
    });
    }
  }
}


