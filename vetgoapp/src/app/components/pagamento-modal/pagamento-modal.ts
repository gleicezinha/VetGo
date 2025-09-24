// src/app/components/pagamento-modal/pagamento-modal.ts
import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AtendimentoResponseDTO } from '../../models/atendimento-response.dto';
import { Pagamento } from '../../models/pagamento';
import { EStatusPagamento } from '../../models/estatuspagamento';
import { PagamentoRequestDTO } from '../../models/pagamento-request-dto';
import { finalize, switchMap } from 'rxjs/operators';
import { PagamentoService } from '../../services/Pagamento';
import { ActivatedRoute, Router, RouterLink } from '@angular/router'; // Importe ActivatedRoute
import { AtendimentoService } from '../../services/atendimento'; // Importe o AtendimentoService

@Component({
  selector: 'app-pagamento-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, RouterLink],
  templateUrl: './pagamento-modal.html',
  styleUrls: ['./pagamento-modal.scss']
})
export class PagamentoModalComponent implements OnInit {
  atendimentoAtual!: AtendimentoResponseDTO;

  procedimentos: { descricao: string; valor: number }[] = [{ descricao: '', valor: 0 }];
  valorTotal = 0;
  valorPago = 0;
  saldoRestante = 0;

  constructor(
    private pagamentoService: PagamentoService,
    private router: Router,
    private route: ActivatedRoute,
    private atendimentoService: AtendimentoService
  ) { }

  ngOnInit() {
    const atendimentoId = this.route.snapshot.paramMap.get('id');

    if (!atendimentoId) {
        console.error('ID do atendimento não fornecido na URL. Abortando.');
        return;
    }

    this.atendimentoService.getAtendimentoById(+atendimentoId).pipe(
        switchMap(atendimento => {
            this.atendimentoAtual = atendimento;
            return this.pagamentoService.getByAtendimentoId(this.atendimentoAtual.id);
        })
    ).subscribe({
      next: (pagamentoExistente) => {
        // Se a descrição salva for uma string única, crie um item para a lista.
        this.procedimentos = [{ descricao: pagamentoExistente.descricao, valor: pagamentoExistente.valorTotal }];
        this.valorTotal = pagamentoExistente.valorTotal;
        this.valorPago = pagamentoExistente.valorPago;
        this.calcularSaldo();
      },
      error: (err) => {
        // CORREÇÃO: Caso o pagamento não exista, continue a inicialização do formulário.
        console.error('Nenhum pagamento existente encontrado para este atendimento. Iniciando com um item vazio.', err);
        // Garante que os valores iniciais estejam corretos, já que não há um pagamento pré-existente
        this.recalcularValores();
      }
    });
  }

  adicionarProcedimento(): void {
    this.procedimentos.push({ descricao: '', valor: 0 });
    this.recalcularValores();
  }

  removerProcedimento(index: number): void {
    this.procedimentos.splice(index, 1);
    this.recalcularValores();
  }

  recalcularValores(): void {
    this.valorTotal = this.procedimentos.reduce((sum, item) => sum + (item.valor || 0), 0);
    this.calcularSaldo();
  }

  calcularSaldo() {
    this.saldoRestante = this.valorTotal - this.valorPago;
  }

  salvarPagamento() {
    let statusFinal: EStatusPagamento;
    if (this.saldoRestante <= 0) {
      statusFinal = EStatusPagamento.PAGO;
    } else {
      statusFinal = EStatusPagamento.PENDENTE;
    }

    const descricaoFinal = this.procedimentos.map(p => p.descricao).join('; ');

    const pagamentoRequest: PagamentoRequestDTO = {
      atendimentoId: this.atendimentoAtual.id,
      responsavelId: this.atendimentoAtual.responsavelId ?? 0,
      descricao: descricaoFinal,
      valorTotal: this.valorTotal,
      valorPago: this.valorPago,
      status: statusFinal
    };

    this.pagamentoService.save(pagamentoRequest).subscribe({
      next: (pagamentoSalvo) => {
        this.router.navigate(['/list-atendimento']);
      },
      error: (err) => {
        console.error('Erro ao salvar o pagamento:', err);
      }
    });
  }
}