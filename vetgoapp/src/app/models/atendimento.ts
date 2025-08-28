import { Paciente } from "./paciente";
import { Profissional } from "./profissional";
import { Responsavel } from "./responsavel";

export type Atendimento = {
  id?: number;
  dataHoraAtendimento: string; // Corrigido para corresponder ao backend
  status: string;
  tipoDeAtendimento: string;
  paciente?: Paciente;
  responsavel?: Responsavel;
  profissional: Profissional;
  observacao: string;  
}