// app/models/atendimento-response.dto.ts

export interface AtendimentoResponseDTO {
    id: number;
    dataHoraAtendimento: string;
    status: string;
    tipoDeAtendimento: string;
    nomePaciente: string;
    nomeResponsavel: string;
    nomeProfissional: string;
    responsavelId?: number;
    observacao?: string;

    // CAMPOS ADICIONADOS PARA CORRESPONDER AO BACKEND
    pacienteId?: number;
    profissionalId?: number;
}