import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/AuthService';
import { AtendimentoService } from '../../services/atendimento'; // IMPORTAR

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
  horariosDisponiveis: string[] = [
    "08:00", "09:00", "10:00", "11:00", "12:00",
    "14:00", "15:00", "16:00", "17:00", "18:00"
  ];
  horarios: string[] = [];
  profissionalIdParaAgendamento = 1; // ID da Dra. Rayssa (conforme data.sql)

  constructor(
    private router: Router,
    private authService: AuthService,
    private atendimentoService: AtendimentoService // INJETAR
  ) { }

  ngOnInit(): void {
    this.authService.isLoggedIn.subscribe(status => {
      this.isLoggedIn = status;
    });
  }

  selecionarData(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.dataSelecionada = input.value;
    this.carregarHorarios();
    this.horarioSelecionado = null;
  }

  carregarHorarios(): void {
    if (!this.dataSelecionada) {
      this.horarios = [];
      return;
    }

    // LÓGICA ATUALIZADA PARA USAR O BACK-END
    this.atendimentoService.getHorariosOcupados(this.profissionalIdParaAgendamento, this.dataSelecionada)
      .subscribe({
        next: (horariosOcupados) => {
          // Extrai apenas a parte da hora (HH:mm)
          const horariosOcupadosFormatados = horariosOcupados.map(h => h.substring(0, 5));
          this.horarios = this.horariosDisponiveis.filter(h => !horariosOcupadosFormatados.includes(h));
        },
        error: (err) => {
          console.error('Erro ao buscar horários:', err);
          this.horarios = this.horariosDisponiveis; // Em caso de erro, mostra todos
        }
      });
  }

  selecionarHorario(horario: string): void {
    this.horarioSelecionado = horario;
  }

  confirmarAgendamento(): void {
    if (!this.isLoggedIn) {
      alert('Você precisa estar logado para agendar um atendimento.');
      this.router.navigate(['/login']);
      return;
    }

    if (!this.dataSelecionada || !this.horarioSelecionado) {
      alert('Selecione a data e o horário antes de confirmar.');
      return;
    }

    // Formata a data e hora no padrão ISO que o backend espera
    const dataHora = `${this.dataSelecionada}T${this.horarioSelecionado}:00`;

    this.router.navigate(['/form-atendimento'], {
      queryParams: {
        dataHora: dataHora
      }
    });
  }
}