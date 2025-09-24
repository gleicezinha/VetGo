import { EStatusPagamento } from "./estatuspagamento";

export interface PagamentoRequestDTO {
    descricao: string;
    valorTotal: number;
    valorPago: number;
    status: EStatusPagamento;
    atendimentoId: number;
    responsavelId: number;
}