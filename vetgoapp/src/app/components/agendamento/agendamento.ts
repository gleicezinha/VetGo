import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-agendamento',
  imports: [CommonModule],
  templateUrl: './agendamento.html',
  styleUrl: './agendamento.scss'
})
export class AgendamentoComponent {
 dataSelecionada: string | null = null;
  horarios: string[] = [
    '06:00','07:00','08:00','09:00','10:00','11:00','12:00',
    '13:00','14:00','15:00','16:00','17:00'
  ];

  selecionarData(event: any) {
    this.dataSelecionada = event.target.value;
  }

  selecionarHorario(hora: string) {
    console.log(`Você selecionou o horário: ${hora}`);
  }
}
