import { Paciente } from "./paciente";
import { Profissional } from "./profissional";

export type Atendimento = {
  id?: number;
  dataDeAtendimento: string; // 'YYYY-MM-DD'
  horarioDeAtendimento: string; // 'HH:mm:ss.SSSSSS'
  status: string;
  tipoDeAtendimento: string;
  paciente: Paciente;
  profissional: Profissional;
  idPai?: number;
  
};