import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ICrudForm } from '../i-crud-form';
import { Atendimento } from '../atendimento/atendimento';
import { AtendimentoService } from '../../services/atendimento';
import { PacienteService } from '../../services/paciente';
import { ResponsavelService } from '../../services/responsavel';
import { ProfissionalService } from '../../services/profissional';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

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

    const agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    agendamentos.push({ data: this.dataSelecionada, horario: this.horarioSelecionado });
    localStorage.setItem('agendamentos', JSON.stringify(agendamentos));

    localStorage.setItem('agendamentoSelecionado', JSON.stringify({ data: this.dataSelecionada, horario: this.horarioSelecionado }));

    alert(`Agendamento confirmado para ${this.dataSelecionada} às ${this.horarioSelecionado}`);


  }
}
