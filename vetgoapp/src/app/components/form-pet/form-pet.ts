import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PacienteService } from '../../services/paciente';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Paciente } from '../../models/paciente';
import { Responsavel } from '../../models/responsavel';
import { ResponsavelService } from '../../services/responsavel';

import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-form-pet',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './form-pet.html',
  styleUrls: ['./form-pet.scss']
})
export class FormPetComponent implements OnInit {

  registro: Paciente = {} as Paciente;
  responsavel: Responsavel = {} as Responsavel;
  
  responsaveisEncontrados: Responsavel[] = [];
  termoBuscaResponsavel: string = '';

  constructor(
    private pacienteService: PacienteService,
    private responsavelService: ResponsavelService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const responsavelId = this.route.snapshot.queryParamMap.get('responsavelId');
    const pacienteId = this.route.snapshot.queryParamMap.get('id');

    if (pacienteId) {
      this.pacienteService.getById(+pacienteId).subscribe({
        next: (resposta: Paciente) => {
          this.registro = resposta;
          if (resposta.responsavel) {
            this.responsavel = resposta.responsavel;
            this.termoBuscaResponsavel = resposta.responsavel.usuario?.nomeUsuario ?? '';
          }
        },
        error: (err) => {
          console.error('Erro ao buscar pet para edição:', err);
        }
      });
    } else if (responsavelId) {
      this.responsavelService.getById(+responsavelId).subscribe({
        next: (resp: Responsavel) => {
          this.responsavel = resp;
          this.registro.responsavel = resp;
        },
        error: (err) => console.error('Erro ao buscar responsável:', err)
      });
    }
  }

  buscarResponsavel(): void {
    if (this.termoBuscaResponsavel.length > 2) {
      this.responsavelService.get(this.termoBuscaResponsavel).subscribe(
        (responsaveis: Responsavel[]) => {
          this.responsaveisEncontrados = responsaveis;
        }
      );
    } else {
      this.responsaveisEncontrados = [];
    }
  }

  selecionarResponsavel(responsavel: Responsavel): void {
    this.responsavel = responsavel;
    this.termoBuscaResponsavel = responsavel.usuario?.nomeUsuario ?? ''; 
    this.responsaveisEncontrados = [];
  }

  save(): void {
    // ⬅️ CORREÇÃO PRINCIPAL: Atribui o responsável ao registro
    this.registro.responsavel = this.responsavel;
    
    // Verifique se o objeto Paciente a ser salvo tem um ID válido.
    if (this.registro.id) {
        this.pacienteService.save(this.registro).subscribe({
            complete: () => {
                alert('Pet atualizado com sucesso!');
                this.router.navigate(['/animais-cliente'], { queryParams: { id: this.responsavel.id } });
            },
            error: (err) => console.error('Erro ao salvar o pet:', err)
        });
    } else {
      // Lógica para criar um novo pet
      if (this.responsavel.id) {
        this.pacienteService.save(this.registro).subscribe({
            complete: () => {
                alert('Pet cadastrado com sucesso!');
                this.router.navigate(['/animais-cliente'], { queryParams: { id: this.responsavel.id } });
            },
            error: (err) => console.error('Erro ao salvar o pet:', err)
        });
      } else {
        // Lógica para criar um novo pet e um novo responsável
        this.responsavelService.save(this.responsavel).pipe(
            switchMap((responsavelSalvo: Responsavel) => {
                this.responsavel = responsavelSalvo;
                this.registro.responsavel = this.responsavel;
                return this.pacienteService.save(this.registro);
            })
        ).subscribe({
            complete: () => {
                alert('Pet e Responsável cadastrados com sucesso!');
                this.router.navigate(['/']);
            },
            error: (err) => console.error('Erro ao salvar:', err)
        });
      }
    }
  }

  cadastrarAtendimento(): void {
    if (this.registro.id) {
      this.router.navigate(['/form-atendimento'], { queryParams: { id: this.registro.id } });
    } else {
      alert('Por favor, salve o pet antes de cadastrar um atendimento.');
    }
  }
}
