import { Endereco } from './endereco.model';

export interface ResponsavelDTO {
  id: number;
  nomeUsuario: string;
  email: string;
  telefone: string;
  endereco?: Endereco;           // <- Adicionado endereço opcional
  statusPagamentos?: string[];   // <- Lista de status de pagamento
}
