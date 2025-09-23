import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Atendimento } from '../../models/atendimento';
import { Pagamento } from '../../models/pagamento';
import { EStatusPagamento } from '../../models/estatuspagamento';

@Component({
  selector: 'app-pagamento-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe],
  templateUrl: './pagamento-modal.component.html',
  styleUrls: ['./pagamento-modal.component.scss']
})
export class PagamentoModalComponent implements OnInit {
  @Input() atendimentoAtual!: Atendimento;
  @Output() close = new EventEmitter<void>();
  @Output() pagamentoSalvo = new EventEmitter<Pagamento>();

  // Campos para o novo modelo de pagamento
  descricaoProcedimento = '';
  valorTotal = 0;
  valorPago = 0;
  saldoRestante = 0;

  constructor() {}

  ngOnInit() {
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

    const novoPagamento: Pagamento = {
      atendimento: this.atendimentoAtual,
      descricao: this.descricaoProcedimento,
      valor: this.valorTotal,
      valorPago: this.valorPago,
      status: statusFinal,
      dataPagamento: new Date().toISOString().split('T')[0]
    };
    
    // Você precisará de um serviço de pagamento para salvar isso no backend.
    
    this.pagamentoSalvo.emit(novoPagamento);
    this.onClose();
  }

  onClose() {
    this.close.emit();
  }
}