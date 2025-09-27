package com.vetgo.vetgoapi.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.vetgo.vetgoapi.model.Atendimento;
import com.vetgo.vetgoapi.model.EStatus;
import com.vetgo.vetgoapi.repository.AtendimentoRepository;

@Service
public class NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);
    private final AtendimentoRepository atendimentoRepository;
    private final WhapiService whapiService;

    public NotificationService(AtendimentoRepository atendimentoRepository, WhapiService whapiService) {
        this.atendimentoRepository = atendimentoRepository;
        this.whapiService = whapiService;
    }

    /**
     * Tarefa agendada para rodar todos os dias às 8h da manhã.
     * Cron expression: second, minute, hour, day of month, month, day(s) of week
     * "0 0 8 * * ?" = 8:00:00 AM todos os dias
     */
    @Scheduled(cron = "0 0 8 * * ?")
    public void sendDailyReminders() {
        logger.info("Iniciando tarefa agendada: Envio de lembretes de consulta...");
        findAndSendRemindersForTomorrow();
        logger.info("Tarefa agendada finalizada.");
    }
    
    /**
     * Lógica central para buscar atendimentos e enviar notificações.
     * Esta função pode ser chamada tanto pela tarefa agendada quanto pelo gatilho de teste.
     */
    public void findAndSendRemindersForTomorrow() {
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        LocalDateTime startOfDay = tomorrow.atStartOfDay();
        LocalDateTime endOfDay = tomorrow.atTime(LocalTime.MAX);

        // Busca atendimentos para amanhã que estão Agendados ou Confirmados
        List<EStatus> validStatuses = Arrays.asList(EStatus.AGENDADO, EStatus.CONFIRMADO);
        List<Atendimento> atendimentos = atendimentoRepository.findAllByDataHoraAtendimentoBetweenAndStatusIn(startOfDay, endOfDay, validStatuses);

        logger.info(atendimentos.size() + " atendimentos encontrados para amanhã (" + tomorrow + ").");

        if (atendimentos.isEmpty()) {
            return;
        }
        
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

        for (Atendimento atendimento : atendimentos) {
            try {
                String nomeResponsavel = atendimento.getPaciente().getResponsavel().getUsuario().getNomeUsuario();
                String nomePet = atendimento.getPaciente().getNome();
                String telefone = atendimento.getPaciente().getResponsavel().getUsuario().getTelefone();
                String horario = atendimento.getDataHoraAtendimento().format(timeFormatter);

                String mensagem = String.format(
                    "Olá, %s! Este é um lembrete da consulta para o seu pet %s, agendada para amanhã, %s, às %s. Atenciosamente, Veterinária Rayssa Gabriela.",
                    nomeResponsavel,
                    nomePet,
                    tomorrow.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")),
                    horario
                );

                logger.info("Enviando lembrete para: " + telefone);
                boolean sent = whapiService.sendMessage(telefone, mensagem);

                if (!sent) {
                     logger.error("Falha ao enviar lembrete para o telefone: " + telefone);
                }
            } catch (Exception e) {
                logger.error("Erro ao processar lembrete para o atendimento ID: " + atendimento.getId(), e);
            }
        }
    }
}