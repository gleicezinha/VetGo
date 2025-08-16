import { Endereco } from "./endereco.model";

export interface Usuario {
  id: number;
  nomeUsuario: string;
  email: string;
  telefone: string;
  cpf: string;
  ativo: boolean;
  papel: 'ROLE_PROFISSIONAL' | 'ROLE_RESPONSAVEL' | 'ROLE_ADMIN';
  endereco?: Endereco;
}