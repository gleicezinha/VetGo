import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/AuthService';
import { AtendimentoService } from '../../services/atendimento';

@Component({
    standalone: true,
    selector: 'app-agendamento',
    imports: [CommonModule, FormsModule],
    templateUrl: './agendamento.html',
    styleUrls: ['./agendamento.scss']
})
export class AgendamentoComponent implements OnInit {

    dataSelecionada: string = '';
    horarioSelecionado: string | null = null;
    isLoggedIn: boolean = false;

    // Lista com TODOS os horários de atendimento possíveis
    horariosDisponiveis: string[] = [
        "08:00", "09:00", "10:00", "11:00", "12:00",
        "14:00", "15:00", "16:00", "17:00", "18:00"
    ];

    // Esta lista armazenará APENAS os horários que estão realmente livres
    horarios: string[] = [];

    profissionalIdParaAgendamento = 1; // ID fixo da Dra. Rayssa
    isDiaCheio: boolean = false;
    dataMinima: string;

    constructor(
        private router: Router,
        private authService: AuthService,
        private atendimentoService: AtendimentoService
    ) {
        // Define a data mínima para hoje, impedindo seleção de datas passadas
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        this.dataMinima = hoje.toISOString().split('T')[0];
    }

    ngOnInit(): void {
        this.authService.isLoggedIn.subscribe((status: boolean) => {
            this.isLoggedIn = status;
        });
    }

    selecionarData(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.dataSelecionada = input.value;
        this.horarioSelecionado = null; // Reseta o horário selecionado ao mudar a data
        this.carregarHorarios();
    }

    carregarHorarios(): void {
        if (!this.dataSelecionada) {
            this.horarios = [];
            return;
        }

        // Chama o serviço para buscar os horários JÁ OCUPADOS no backend
        this.atendimentoService.getHorariosOcupados(this.profissionalIdParaAgendamento, this.dataSelecionada)
            .subscribe({
                next: (horariosOcupados) => {
                    // Formata os horários para 'HH:mm'
                    const horariosOcupadosFormatados = horariosOcupados.map(h => h.substring(0, 5));

                    // Filtra a lista principal, mantendo APENAS os horários que NÃO estão na lista de ocupados
                    this.horarios = this.horariosDisponiveis.filter(h => !horariosOcupadosFormatados.includes(h));

                    this.isDiaCheio = this.horarios.length === 0;
                },
                error: (err) => {
                    console.error('Erro ao buscar horários ocupados:', err);
                    // Em caso de erro, assume que todos estão disponíveis para não bloquear o usuário
                    this.horarios = [...this.horariosDisponiveis];
                }
            });
    }

    // **LÓGICA DO CLIQUE ATUALIZADA**
    selecionarHorario(horario: string): void {
        // Verifica se o horário clicado está na lista de horários LIVRES (`this.horarios`)
        if (this.horarios.includes(horario)) {
            this.horarioSelecionado = horario; // Se estiver livre, seleciona
        } else {
            // Se NÃO estiver na lista de livres, significa que está ocupado
            alert('Este horário já está ocupado. Por favor, escolha um horário disponível em verde.');
        }
    }

    confirmarAgendamento(): void {
        if (!this.isLoggedIn) {
            alert('Você precisa estar logado para agendar um atendimento.');
            this.router.navigate(['/login']);
            return;
        }

        if (!this.dataSelecionada || !this.horarioSelecionado) {
            alert('Selecione a data e um horário disponível antes de confirmar.');
            return;
        }

        const dataHora = `${this.dataSelecionada}T${this.horarioSelecionado}:00`;

        this.router.navigate(['/form-atendimento'], {
            queryParams: { dataHora: dataHora }
        });
    }
}