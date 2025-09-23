import { Atendimento } from "./atendimento";
import { Paciente } from "./paciente";
import { EAtendimento } from "./eatendimento.model";

export interface Procedimento {
    id?: number;
    paciente: Paciente;
    atendimento: Atendimento;
    tipo: EAtendimento;
    nome: string;
    dataAtendimento: string;
    dataProximaDose?: string;
    dose?: string;
    fabricante?: string;
    lote?: string;
    viaAplicacao?: string;
    posologia?: string;
    observacoes?: string;
}