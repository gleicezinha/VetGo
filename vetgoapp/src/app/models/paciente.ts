import { Responsavel } from "./responsavel";


export interface Paciente {
    id: number;
    nome: string;
    especie: 'GATO' | 'CACHORRO';
    raca: string;
    sexo: 'M' | 'F';
    peso: number; // Peso em kg
    dataNascimento: string; // Tipo string, o front-end precisa convertê-la se for usar como data
    situacao: 'VIVO' | 'MORTO';
    responsavel?: Responsavel;
}