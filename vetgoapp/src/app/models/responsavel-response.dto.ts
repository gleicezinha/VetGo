export interface ResponsavelResponseDTO {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  statusPagamento: 'PAGO' | 'PENDENTE';
}