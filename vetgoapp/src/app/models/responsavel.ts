// src/app/models/responsavel.model.ts
import { Usuario } from "./usuario";

export interface Responsavel {
  id: number;
  usuario?: Usuario;
  // O relacionamento inverso com o pet não é comum em APIs REST,
  // mas se sua API o retornar, adicione o campo.
  // pets?: Paciente[];
}