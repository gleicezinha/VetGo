import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AtendimentoResponseDTO } from '../../models/atendimento-response.dto';
import { Pagamento } from '../../models/pagamento';
import { EStatusPagamento } from '../../models/estatuspagamento';
import { PagamentoRequestDTO } from '../../models/pagamento-request-dto';
import { finalize } from 'rxjs/operators';
import { PagamentoService } from '../../services/Pagamento';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pagamento-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe],
  templateUrl: './pagamento-modal.html',
  styleUrls: ['./pagamento-modal.scss']
})
export class PagamentoModalComponent implements OnInit {
  @Input() atendimentoAtual!: AtendimentoResponseDTO;
  @Output() close = new EventEmitter<void>();
  @Output() pagamentoSalvo = new EventEmitter<Pagamento>();

  procedimentos: { descricao: string; valor: number }[] = [{ descricao: '', valor: 0 }];
  valorTotal = 0;
  valorPago = 0;
  saldoRestante = 0;

  constructor(private pagamentoService: PagamentoService, private router: Router  ) { }

  ngOnInit() {
    if (!this.atendimentoAtual || !this.atendimentoAtual.id) {
        console.error('atendimentoAtual é undefined ou não tem ID. Abortando inicialização do modal.');
        return;
    }

    this.pagamentoService.getByAtendimentoId(this.atendimentoAtual.id).subscribe({
      next: (pagamentoExistente) => {
        // Se a descrição salva for uma string única, crie um item para a lista.
        this.procedimentos = [{ descricao: pagamentoExistente.descricao, valor: pagamentoExistente.valorTotal }];
        this.valorTotal = pagamentoExistente.valorTotal;
        this.valorPago = pagamentoExistente.valorPago;
        this.calcularSaldo();
      },
      error: (err) => {
        console.error('Nenhum pagamento existente encontrado para este atendimento. Iniciando com um item vazio.', err);
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
        this.pagamentoSalvo.emit(pagamentoSalvo);
        this.onClose();
      },
      error: (err) => {
        console.error('Erro ao salvar o pagamento:', err);
      }
    });
  }

  onClose() {
    this.close.emit();
    this.router.navigate(['/list-atendimento']);
  }
}