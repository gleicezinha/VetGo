// app/components/calendario/calendario.ts

import { Component, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput, EventClickArg } from '@fullcalendar/core'; // Adicione EventClickArg
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import { AtendimentoService } from '../../services/atendimento';
import { AuthService } from '../../services/AuthService';
import { PacienteService } from '../../services/paciente';
import { ResponsavelService } from '../../services/responsavel';
import { forkJoin, of, switchMap } from 'rxjs';
import { AtendimentoResponseDTO } from '../../models/atendimento-response.dto'; // Adicione este import
import { CommonModule, DatePipe } from '@angular/common'; // Adicione CommonModule, DatePipe
import { MatButtonModule } from '@angular/material/button'; // Adicione MatButtonModule

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [FullCalendarModule, CommonModule, DatePipe, MatButtonModule], // Atualize os imports
  templateUrl: './calendario.html',
  styleUrls: ['./calendario.scss']
})
export class CalendarioComponent implements OnInit {

  eventos: EventInput[] = [];

  atendimentosPorDia = new Map<string, number>();
  totalHorariosDisponiveis = 10;

  // ADICIONE ESTAS DUAS NOVAS PROPRIEDADES
  detalheAtendimento: AtendimentoResponseDTO | null = null;
  showModal = false;

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
    dayMaxEvents: true,
    events: [],
    dayCellDidMount: this.handleDayCellMount.bind(this),

    // ADICIONE O MANIPULADOR DE CLIQUE
    eventClick: this.handleEventClick.bind(this),

    // ADICIONE O MANIPULADOR DE MONTAGEM DO EVENTO (PARA O HOVER)
    eventDidMount: (info) => {
      // Cria a string do tooltip
      const detalhes = info.event.extendedProps;
      const tooltipText = `Paciente: ${detalhes['nomePaciente']}\nTipo: ${detalhes['tipoDeAtendimento']}\nStatus: ${detalhes['status']}\nProfissional: ${detalhes['nomeProfissional'] || 'N/A'}`;
      // Adiciona a string como o atributo 'title' do elemento, criando a dica de ferramenta.
      info.el.setAttribute('title', tooltipText);
    }
  };

  constructor(
    private atendimentoService: AtendimentoService,
    private authService: AuthService,
    private pacienteService: PacienteService,
    private responsavelService: ResponsavelService
  ) { }

  ngOnInit(): void {
    this.carregarEventos();
  }

  carregarEventos(): void {
    const user = this.authService.currentUserValue;

    const mapAtendimentoToEvent = (atd: AtendimentoResponseDTO): EventInput => ({
      title: `${atd.nomePaciente} (${atd.tipoDeAtendimento})`,
      start: atd.dataHoraAtendimento,
      extendedProps: {
        id: atd.id,
        nomePaciente: atd.nomePaciente,
        nomeResponsavel: atd.nomeResponsavel,
        nomeProfissional: atd.nomeProfissional,
        tipoDeAtendimento: atd.tipoDeAtendimento,
        status: atd.status
      }
    });

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
        }),
        switchMap(atendimentosPorPaciente => {
          const idsAtendimentos = atendimentosPorPaciente.flat().map(atd => atd.id).filter(id => id !== undefined);
          const detailCalls = idsAtendimentos.map(id => this.atendimentoService.getAtendimentoById(id));
          if (detailCalls.length === 0) {
            return of([]);
          }
          return forkJoin(detailCalls);
        })
      ).subscribe({
        next: (atendimentosDetalhados) => {
          this.eventos = atendimentosDetalhados.map(mapAtendimentoToEvent);
          this.calendarOptions.events = this.eventos;
          this.recalcularAtendimentosPorDia();
        },
        error: (err) => {
          console.error('Erro ao carregar atendimentos do responsável:', err);
        }
      });
    } else {
      this.atendimentoService.getAll().subscribe(atendimentos => {
        this.eventos = atendimentos.map(mapAtendimentoToEvent);
        this.calendarOptions.events = this.eventos;
        this.recalcularAtendimentosPorDia();
      });
    }
  }

  handleEventClick(info: EventClickArg): void {
    const atendimentoId = info.event.extendedProps['id'];
    if (atendimentoId) {
      this.atendimentoService.getAtendimentoById(atendimentoId).subscribe({
        next: (atendimentoDetalhado) => {
          this.detalheAtendimento = atendimentoDetalhado;
          this.showModal = true;
        },
        error: (err) => {
          console.error('Erro ao buscar detalhes do atendimento:', err);
        }
      });
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.detalheAtendimento = null;
  }

  // O restante do código do componente continua aqui...
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