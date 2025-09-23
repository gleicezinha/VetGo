import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AtendimentoService } from '../../services/atendimento';
import { AtendimentoResponseDTO } from '../../models/atendimento-response.dto';
import { AuthService } from '../../services/AuthService';
import { ResponsavelService } from '../../services/responsavel';
import { PacienteService } from '../../services/paciente';
import { forkJoin, of, switchMap } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { ResponsavelResponseDTO } from '../../models/responsavel-response.dto';

@Component({
    selector: 'app-list-cliente',
    standalone: true,
    imports: [CommonModule,  RouterModule, MatMenuModule, MatButtonModule],
    templateUrl: './list-cliente.html',
    styleUrls: ['./list-cliente.scss']
})
export class ListClienteComponent implements OnInit {

    clientes: ResponsavelResponseDTO[] = [];

    constructor(
        private responsavelService: ResponsavelService,
        private router: Router,
        private cdr: ChangeDetectorRef,
    ) { }

    ngOnInit(): void {
        this.carregarClientes();
    }

    carregarClientes(): void {
        this.responsavelService.getComStatusPagamento().subscribe({
            next: (dados: ResponsavelResponseDTO[]) => {
                this.clientes = dados;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Erro ao carregar clientes:', err);
            }
        });
    }

    editarCliente(clienteId: number): void {
        this.router.navigate(['/form-cliente'], { queryParams: { id: clienteId } });
    }

    excluirCliente(clienteId: number): void {
      if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
        // Lógica de exclusão
      }
    }

    visualizarAnimais(responsavelId: number): void {
      this.router.navigate(['/animais-cliente'], { queryParams: { id: responsavelId } });
    }
}