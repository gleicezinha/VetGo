import { Component, OnInit } from '@angular/core';
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
 standalone: true,
 selector: 'app-list-cliente',
 imports: [RouterLink, MatFormFieldModule, MatInputModule, MatMenuModule, CommonModule, FormsModule, RouterModule],
 templateUrl: './list-cliente.html',
 styleUrls: ['./list-cliente.scss']
})
export class ListClienteComponent implements ICrudList<Responsavel>, OnInit {
 termoBusca: string = '';
 
 // Lista completa de responsáveis (sem filtro)
 registros: Responsavel[] = [];
 // Lista de responsáveis exibida na tela (filtrada)
 registrosFiltrados: Responsavel[] = [];

 constructor(
  private servico: ResponsavelService,
  private router: Router
 ) { }

 ngOnInit(): void {
  this.get();
 }

 // Busca todos os responsáveis na API
 get(): void {
  this.servico.get().subscribe({
   next: (resposta: Responsavel[]) => {
    this.registros = resposta;
    this.registrosFiltrados = resposta; // Inicialmente, a lista filtrada é a lista completa
    console.log(this.registros);
   },
   error: (erro) => {
    console.error('Erro ao buscar responsáveis:', erro);
   },
  });
 }

 // Filtra a lista local com base no termo de busca
 buscarComTermo(termoBusca: string): void {
  const termo = termoBusca.trim().toLowerCase();
  
  this.registrosFiltrados = this.registros.filter((responsavel) => {

 const nomeUsuario = responsavel.usuario?.nomeUsuario?.toLowerCase() || '';
 const email = responsavel.usuario?.email?.toLowerCase() || '';
  const telefone = responsavel.usuario?.telefone?.toLowerCase() || '';

 return nomeUsuario.includes(termo) || email.includes(termo) || telefone.includes(termo);
  });
 }

 cadastrar(): void {
   this.router.navigate(['/form-cliente']);
 }

  editar(responsavel: Responsavel): void {
     this.router.navigate(['/form-cliente'], { queryParams: { id: responsavel.id } });
  }
 
  delete(id: number): void {
    // Substituir 'confirm()' por um modal de confirmação personalizado
    if (window.confirm('Deseja realmente EXCLUIR o responsável?')) {
      this.servico.delete(id).subscribe({
        next: () => {
          // Atualiza a lista após a exclusão
          this.get();
        },
        error: (erro) => {
          console.error('Erro ao excluir responsável:', erro);
        }
      });
    }
  }
}
