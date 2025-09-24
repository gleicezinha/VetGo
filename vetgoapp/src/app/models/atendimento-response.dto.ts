// app/models/atendimento-response.dto.ts

export interface AtendimentoResponseDTO {
    id: number;
    dataHoraAtendimento: string;
    status: string;
    tipoDeAtendimento: string;
    nomePaciente: string;
    nomeResponsavel: string;
    nomeProfissional: string;
    // CORREÇÃO: Adicione a propriedade para o ID do responsável
    responsavelId?: number;
    observacao?: string;
}