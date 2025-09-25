import { Atendimento } from "./atendimento";
import { AtendimentoResponseDTO } from "./atendimento-response.dto";
import { EStatusPagamento } from "./estatuspagamento";
import { Responsavel } from "./responsavel";


export interface Pagamento {
  id: number;
  valorTotal: number;
  atendimento: AtendimentoResponseDTO; // em vez de Atendimento
  descricao: string;
  valor: number;
  valorPago: number;
  status: EStatusPagamento;
  dataPagamento: string;
}