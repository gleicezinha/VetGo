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
  imports: [FormsModule, CommonModule,  ReactiveFormsModule],
  templateUrl: './form-atendimento.html',
  styleUrl: './form-atendimento.scss'
})
export class FormAtendimentoComponent  {


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
  }
  registro: Atendimento = <Atendimento>{};
  pacientes: Paciente[] = []; 
  responsaveis: Responsavel[] = [];
  profissionais: Profissional[] = [];
  compareById = (a: any, b: any) => {
    return a && b && a.id == b.id;
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


