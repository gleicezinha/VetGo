export interface AtendimentoResponseDTO {
    id: number;
    dataHoraAtendimento: string;
    status: string;
    tipoDeAtendimento: string;
    nomePaciente: string;
    nomeResponsavel: string;
    nomeProfissional: string;
}