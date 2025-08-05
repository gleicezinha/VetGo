export type Paciente = {
    id: number;
    nome: string;
    nomeresposavel: string;
    telefone: string;
    dataNascimento: Date;
    especie: string;
    raca: string;
    sexo: 'Macho' | 'Fêmea';
    vida: string;
    peso: number;
    
};
