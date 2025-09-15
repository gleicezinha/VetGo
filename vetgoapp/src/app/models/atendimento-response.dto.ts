// app/models/atendimento-response.dto.ts

export interface AtendimentoResponseDTO {
    id: number;
    dataHoraAtendimento: string;
    status: string;
    tipoDeAtendimento: string;
    nomePaciente: string;
    nomeResponsavel: string;
    nomeProfissional: string;
    // APROVAÇÃO: Adicione as novas propriedades para sincronizar com o backend
    pacienteId?: number;
    responsavelId?: number;
    profissionalId?: number;
    observacao?: string; // Adicione também esta propriedade, pois o formulário a utiliza
}