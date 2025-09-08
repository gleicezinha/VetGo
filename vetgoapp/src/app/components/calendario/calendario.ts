import { Component, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import { AtendimentoService } from '../../services/atendimento';
import { AuthService } from '../../services/AuthService';
import { PacienteService } from '../../services/paciente';
import { ResponsavelService } from '../../services/responsavel';
import { forkJoin, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [FullCalendarModule],
  templateUrl: './calendario.html',
  styleUrls: ['./calendario.scss']
})
export class CalendarioComponent implements OnInit {

  eventos: EventInput[] = [];

  atendimentosPorDia = new Map<string, number>();
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
    events: [],
    dayCellDidMount: this.handleDayCellMount.bind(this)
  };

  constructor(
    private atendimentoService: AtendimentoService,
    private authService: AuthService,
    private pacienteService: PacienteService,
    private responsavelService: ResponsavelService
  ) {}

  ngOnInit(): void {
    this.carregarEventos();
  }

  carregarEventos(): void {
    const user = this.authService.currentUserValue;

    if (user && user.papel === 'ROLE_RESPONSAVEL') {
      this.responsavelService.getByUsuarioId(user.id).pipe(
        switchMap(responsavel => {
          if (!responsavel || !responsavel.id) {
            return of([]);
          }
          return this.pacienteService.getByResponsavelId(responsavel.id);
        }),
        switchMap(pacientes => {
          if (!pacientes || pacientes.length === 0) {
            return of([]);
          }
          const atendimentoCalls = pacientes.map(paciente =>
            this.atendimentoService.getByPacienteId(paciente.id)
          );
          return forkJoin(atendimentoCalls);
        })
      ).subscribe({
        next: (atendimentosPorPaciente) => {
          this.eventos = atendimentosPorPaciente.flat().map(atd => ({
            title: `${atd.paciente?.nome || 'Pet'} (${atd.tipoDeAtendimento})`,
            start: atd.dataHoraAtendimento,
          }));
          this.calendarOptions.events = this.eventos;
          this.recalcularAtendimentosPorDia();
        },
        error: (err) => {
          console.error('Erro ao carregar atendimentos do responsável:', err);
        }
      });
    } else {
      this.atendimentoService.getAll().subscribe(atendimentos => {
        this.eventos = atendimentos.map(atd => ({
          title: `${atd.nomePaciente} (${atd.tipoDeAtendimento})`,
          start: atd.dataHoraAtendimento,
        }));
        this.calendarOptions.events = this.eventos;
        this.recalcularAtendimentosPorDia();
      });
    }
  }
  
  recalcularAtendimentosPorDia(): void {
    this.atendimentosPorDia.clear();
    this.eventos.forEach(evento => {
      const data = (evento.start as string).split('T')[0];
      const contagemAtual = this.atendimentosPorDia.get(data) || 0;
      this.atendimentosPorDia.set(data, contagemAtual + 1);
    });
  }

  handleDayCellMount(info: any) {
    const data = info.date.toISOString().split('T')[0];
    const contagem = this.atendimentosPorDia.get(data) || 0;
    const user = this.authService.currentUserValue;

    if (contagem === 0) {
      info.el.classList.add('dia-livre');
    } else if (contagem >= this.totalHorariosDisponiveis) {
      if (user && user.papel === 'ROLE_RESPONSAVEL') {
        info.el.classList.add('dia-responsavel-ocupado');
      } else {
        info.el.classList.add('dia-ocupado');
      }
    }
  }
}