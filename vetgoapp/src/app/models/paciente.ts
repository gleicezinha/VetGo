import { Responsavel } from "./responsavel";

export type Paciente = {
    id: number;
    nome: string;
    responsavel: Responsavel;
    telefone: string;
    dataNascimento: Date;
    especie: string;
    raca: string;
    sexo: 'Macho' | 'Fêmea';
    vida: string;
    peso: number;
    
};
