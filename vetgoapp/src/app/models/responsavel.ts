import {Paciente } from './paciente';
export type Responsavel = {
    id: number;
    nome: string;
    pet: Paciente;
    cpf: string;
    email: string;
    cep: string;
    telefone: string;
    endereco: string;
    numero: string;
    uf: string;
    complemento: string;
    bairro: string;
    cidade: string;
    estado: string;
}
