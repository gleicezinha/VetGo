import { Component } from '@angular/core';
import { ICrudList } from '../i-crud-list';
import { Responsavel } from '../../models/responsavel';
import { ResponsavelService } from '../../services/responsavel';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-list-cliente',
  imports: [RouterLink,  MatFormFieldModule,
    MatInputModule, MatMenuModule, CommonModule, FormsModule],
  templateUrl: './list-cliente.html',
  styleUrl: './list-cliente.scss'
})
export class ListClienteComponent implements ICrudList<Responsavel>{
termoBusca: string = '';
  constructor(
    private servico: ResponsavelService,
    private router: Router
  ){ }
  
  ngOnInit(): void {
    this.get();
  }
  termoBuscaAtual: string | undefined = '';
  registros: Responsavel[] = [];
  registrosFiltrados: Responsavel[] = [];
 
  get(termoBusca?: string): void {
    this.termoBuscaAtual = termoBusca;
    this.servico.get(this.termoBuscaAtual).subscribe({
      next: (resposta: Responsavel[]) => {
        this.registros = resposta;
        this.registrosFiltrados = resposta;
        console.log(this.registros);
      },
      error: (erro) => {
        console.error('Erro ao buscar pacientes:', erro);
      },
    });
  }
buscarComTermo(termoBusca: string): void {
    termoBusca = termoBusca.trim().toLowerCase();
    this.registrosFiltrados = this.registros.filter(
      (responsavel) =>
        responsavel.nome.toLowerCase().startsWith(termoBusca) ||
        responsavel.email.toLowerCase().startsWith(termoBusca) ||
        responsavel.telefone.toLowerCase().startsWith(termoBusca)
    );
    console.log('Responsáveis filtrados:', this.registrosFiltrados);
  }
cadastrar(): void {
    this.router.navigate(['/form-cliente']);
  }
  editar(responsavel: Responsavel): void {
    this.router.navigate(['/form-cliente'], { queryParams: { id: responsavel.id } });
  }
  delete(id: number): void {
    if(confirm('Deseja realmente EXCLUIR o responsável?')){
      this.servico.delete(id).subscribe({
        next: () => {
          this.get(this.termoBuscaAtual);
        },
        error: (erro) => {
          console.error('Erro ao excluir responsável:', erro);
        }
      });
    }
  }  
}
