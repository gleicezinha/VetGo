import { Responsavel } from "./responsavel";

export type Paciente = {
    id: number;
    nome: string;
    responsavelId: number;
    dataNascimento: Date;
    especie: string;
    raca: string;
    sexo: 'Macho' | 'Fêmea';
    vida: string;
    peso: number;
    
};
