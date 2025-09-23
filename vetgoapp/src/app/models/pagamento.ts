import { Atendimento } from "./atendimento";
import { EStatusPagamento } from "./estatuspagamento";
import { Responsavel } from "./responsavel";


export interface Pagamento {
    id?: number;
    responsavel?: Responsavel;
    atendimento?: Atendimento;
    descricao?: string;
    valor?: number;
    valorPago?: number;
    dataPagamento?: string;
    status?: EStatusPagamento;
}