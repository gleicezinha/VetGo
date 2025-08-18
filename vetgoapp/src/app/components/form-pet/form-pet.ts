import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PacienteService } from '../../services/paciente';
import { ResponsavelService } from '../../services/responsavel';
import { ActivatedRoute, Router } from '@angular/router';
import { Paciente } from '../../models/paciente';
import { Responsavel } from '../../models/responsavel';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-form-pet',
  imports: [CommonModule, FormsModule],
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
    const pacienteId = this.route.snapshot.queryParamMap.get('id');
    const responsavelId = this.route.snapshot.queryParamMap.get('responsavelId');

    if (pacienteId) {
        // Fluxo de Edição
        this.pacienteService.getById(+pacienteId).subscribe({
            next: (resposta: Paciente) => {
                this.registro = resposta;
                // Como o 'responsavel' é ignorado pelo JSON do backend,
                // precisamos buscá-lo separadamente usando o 'responsavelId'
                if (responsavelId) {
                    this.responsavelService.getById(+responsavelId).subscribe({
                        next: (resp: Responsavel) => {
                            this.responsavel = resp;
                            this.termoBuscaResponsavel = resp.usuario?.nomeUsuario ?? '';
                            // Garante que o objeto `responsavel` seja atribuído
                            // corretamente ao `registro` antes de salvar.
                            this.registro.responsavel = resp;
                        },
                        error: (err) => console.error('Erro ao buscar responsável:', err)
                    });
                }
            },
            error: (err) => {
                console.error('Erro ao buscar pet para edição:', err);
            }
        });
    } else if (responsavelId) {
        // Fluxo de Cadastro de Novo Pet
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
    // Atribui o responsável ao registro
    this.registro.responsavel = this.responsavel;
    
    // Verifique se o objeto Paciente a ser salvo tem um ID válido.
    if (this.registro.id) {
      this.pacienteService.save(this.registro).subscribe({
        complete: () => {
          alert('Pet atualizado com sucesso!');
          // Redireciona para a rota correta com o ID como parâmetro de URL
          this.router.navigate(['/animais-cliente', this.responsavel.id]);
        },
        error: (err) => console.error('Erro ao salvar o pet:', err)
      });
    } else {
      // Lógica para criar um novo pet
      if (this.responsavel.id) {
        this.pacienteService.save(this.registro).subscribe({
          complete: () => {
            alert('Pet cadastrado com sucesso!');
            // Redireciona para a rota correta com o ID como parâmetro de URL
            this.router.navigate(['/animais-cliente', this.responsavel.id]);
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

  cancel(): void {
    if (this.registro.responsavel?.id) {
      this.router.navigate(['/animais-cliente', this.registro.responsavel.id]);
    } else {
      this.router.navigate(['/']);
    }
  }
  cadastrarAtendimento(): void {
    this.router.navigate(['/form-atendimento'], { queryParams: { pacienteId: this.registro.id } });
  }
}