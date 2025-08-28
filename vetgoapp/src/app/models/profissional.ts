import { Usuario } from "./usuario";

export type Profissional = {
    id: number;
    registro: string;
    usuario?: Usuario; // Adicionado para corresponder ao backend
}