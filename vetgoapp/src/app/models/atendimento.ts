import { Paciente } from "./paciente";
import { Profissional } from "./profissional";
import { Responsavel } from "./responsavel";

export type Atendimento = {
  id?: number;
  dataDeAtendimento: string; // 'YYYY-MM-DD'
  horarioDeAtendimento: string; // 'HH:mm:ss.SSSSSS'
  status: string;
  tipoDeAtendimento: string;
  paciente: Paciente;  
  responsavel: Responsavel;
  profissional: Profissional;
  observacao: string;  
}
