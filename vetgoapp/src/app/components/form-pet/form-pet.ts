import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PacienteService } from '../../services/paciente';
import { ActivatedRoute, Router } from '@angular/router';
import { Paciente } from '../../models/paciente';
import { Responsavel } from '../../models/responsavel';
import { ResponsavelService } from '../../services/responsavel';

@Component({
  selector: 'app-form-pet',
  imports: [FormsModule, CommonModule],
  templateUrl: './form-pet.html',
  styleUrl: './form-pet.scss'
})
export class FormPetComponent implements OnInit {
  ngOnInit(): void {
    const id = this.route.snapshot.queryParamMap.get('id');
    if (id) {
      this.servico.getById(+id).subscribe({
        next: (resposta: any) => {
          this.registro = resposta;
          this.responsavel = resposta.responsavel;
        }
      });
    }
  }
  compareById = (a: any, b: any) => {
    return a && b && a.id == b.id;
  }

  registro : Paciente = <Paciente>{};
  responsavel: Responsavel = <Responsavel>{};
  constructor(
    private servico: PacienteService, // Assuming this is a service for handling form data
    private responsavelService: ResponsavelService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  save(): void {
    this.servico.save(this.registro).subscribe({
      complete: () => {
        alert('Responsável cadastrado com sucesso!');
        
      }
    });
  }
  cadastrarAtendimento(): void {
    this.router.navigate(['/form-atendimento'], { queryParams: { id: this.registro.id } });
  }
}