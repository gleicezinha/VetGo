import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-agendamento',
  imports: [CommonModule, FormsModule],
  templateUrl: './agendamento.html',
  styleUrl: './agendamento.scss'
})
export class AgendamentoComponent implements OnInit {

  dataSelecionada: string = '';
  horarioSelecionado: string | null = null;

  horariosDisponiveis: string[] = [
    "08:00", "09:00", "10:00", "11:00",
    "12:00", "13:00",
    "14:00", "15:00", "16:00", "17:00"
  ];
  horarios: string[] = [];

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Inicialização, se precisar
  }

  selecionarData(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.dataSelecionada = input.value;
    this.carregarHorarios();
    this.horarioSelecionado = null; // limpa seleção anterior
  }

  carregarHorarios(): void {
    if (!this.dataSelecionada) {
      this.horarios = [];
      return;
    }

    const agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    const horariosOcupados = agendamentos
      .filter((a: any) => a.data === this.dataSelecionada)
      .map((a: any) => a.horario);

    this.horarios = this.horariosDisponiveis.filter(h => !horariosOcupados.includes(h));
  }

  selecionarHorario(horario: string): void {
    this.horarioSelecionado = horario;
  }

  confirmarAgendamento(): void {
    if (!this.dataSelecionada || !this.horarioSelecionado) {
      alert('Selecione a data e o horário antes de confirmar.');
      return;
    }

    // Combina a data e a hora no formato esperado pelo input datetime-local
    const dataHora = `${this.dataSelecionada}T${this.horarioSelecionado}`;

    // Navega para o formulário de atendimento com a data e hora como parâmetros
    this.router.navigate(['/form-atendimento'], { 
      queryParams: { 
        dataHora: dataHora
      } 
    });
  }
}