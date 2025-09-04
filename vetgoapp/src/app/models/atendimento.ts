import { Paciente } from "./paciente";
import { Profissional } from "./profissional";
import { Responsavel } from "./responsavel";

export interface Atendimento {
  id?: number;
  dataHoraAtendimento: string;
  status: string;
  tipoDeAtendimento: string;
  paciente?: Paciente;
  responsavel?: Responsavel;
  profissional: Profissional;
  observacao: string;
}