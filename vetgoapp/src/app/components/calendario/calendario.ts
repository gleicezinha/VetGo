import { Component, OnInit } from '@angular/core'; // 1. Importe o OnInit
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core'; // 2. Importe EventInput
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import { AtendimentoService } from '../../services/atendimento'; // 3. Importe o serviço

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [FullCalendarModule],
  templateUrl: './calendario.html',
  styleUrls: ['./calendario.scss']
})
export class CalendarioComponent implements OnInit { // 4. Implemente OnInit

  // Propriedade para guardar os eventos do calendário
  eventos: EventInput[] = [];

  // Mapa para contar atendimentos por dia
  atendimentosPorDia = new Map<string, number>();
  // Defina o total de horários disponíveis por dia
  totalHorariosDisponiveis = 10;

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek'
    },
    locale: ptBrLocale,
    buttonText: {
      today: 'Hoje',
      month: 'Mês',
      week: 'Semana',
      day: 'Dia'
    },
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    events: [], // Inicialmente vazio, será preenchido
    dayCellDidMount: this.handleDayCellMount.bind(this) // Callback para estilizar os dias
  };

  // 5. Injete o serviço no construtor
  constructor(private atendimentoService: AtendimentoService) { }

  // 6. Crie o método ngOnInit para carregar os dados
  ngOnInit(): void {
    this.carregarEventos();
  }

  carregarEventos(): void {
    this.atendimentoService.getAll().subscribe(atendimentos => {

      // Limpa o mapa de contagem antes de recalcular
      this.atendimentosPorDia.clear();

      // Mapeia os atendimentos para o formato que o FullCalendar entende
      this.eventos = atendimentos.map(atd => {
        const dia = atd.dataHoraAtendimento.split('T')[0]; // Pega a data no formato YYYY-MM-DD

        // Conta quantos atendimentos existem para cada dia
        const contagemAtual = this.atendimentosPorDia.get(dia) || 0;
        this.atendimentosPorDia.set(dia, contagemAtual + 1);

        return {
          title: `${atd.nomePaciente} (${atd.tipoDeAtendimento})`,
          start: atd.dataHoraAtendimento,
          // Você pode adicionar mais propriedades aqui, como cores por tipo de evento
        };
      });

      // Atualiza as opções do calendário com os novos eventos
      this.calendarOptions.events = this.eventos;
    });
  }

  // 7. Crie o método para estilizar as células dos dias
  handleDayCellMount(info: any) {
    const data = info.date.toISOString().split('T')[0]; // Formata a data da célula
    const contagem = this.atendimentosPorDia.get(data) || 0;

    if (contagem === 0) {
      info.el.classList.add('dia-livre');
    } else if (contagem >= this.totalHorariosDisponiveis) {
      info.el.classList.add('dia-ocupado');
    }
  }
}