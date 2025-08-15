export type Endereco = {
  id?: number;
  logradouro: string;
  numero: string;
  complemento?: string; // Propriedade opcional
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}