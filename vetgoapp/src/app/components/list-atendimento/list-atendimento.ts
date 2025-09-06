import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // 1. Importar ChangeDetectorRef
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AtendimentoService } from '../../services/atendimento';
import { AtendimentoResponseDTO } from '../../models/atendimento-response.dto';

@Component({
    selector: 'app-list-atendimento',
    standalone: true,
    imports: [CommonModule, DatePipe],
    templateUrl: './list-atendimento.html',
    styleUrls: ['./list-atendimento.scss']
})
export class ListAtendimentoComponent implements OnInit {

    atendimentos: AtendimentoResponseDTO[] = [];

    constructor(
        private atendimentoService: AtendimentoService,
        private router: Router,
        private cdr: ChangeDetectorRef // 2. Injetar o ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.carregarAtendimentos();
    }

    carregarAtendimentos(): void {
        this.atendimentoService.getAll().subscribe({
            next: (dados) => {
                this.atendimentos = dados;
                this.cdr.detectChanges(); // 3. Forçar a detecção de mudanças
            },
            error: (err) => {
                console.error('Erro ao carregar atendimentos:', err);
            }
        });
    }

    voltar(): void {
        this.router.navigate(['/agendamento']);
    }
}