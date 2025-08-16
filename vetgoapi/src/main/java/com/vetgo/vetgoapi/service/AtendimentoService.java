package com.vetgo.vetgoapi.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vetgo.vetgoapi.model.Atendimento;
import com.vetgo.vetgoapi.model.EStatus;
import com.vetgo.vetgoapi.model.Paciente;
import com.vetgo.vetgoapi.model.Profissional;
import com.vetgo.vetgoapi.repository.AtendimentoRepository;
import com.vetgo.vetgoapi.repository.PacienteRepository;
import com.vetgo.vetgoapi.repository.ProfissionalRepository;
import com.vetgo.vetgoapi.service.exception.BusinessRuleException;
import com.vetgo.vetgoapi.service.exception.ResourceNotFoundException;

@Service
public class AtendimentoService {

    private final AtendimentoRepository atendimentoRepository;
    private final PacienteRepository pacienteRepository;
    private final ProfissionalRepository profissionalRepository;

    public AtendimentoService(AtendimentoRepository aRepo, PacienteRepository pRepo, ProfissionalRepository profRepo) {
        this.atendimentoRepository = aRepo;
        this.pacienteRepository = pRepo;
        this.profissionalRepository = profRepo;
    }

    @Transactional
    public Atendimento agendarConsulta(Atendimento atendimento, Long pacienteId, Long profissionalId) {
        Paciente paciente = pacienteRepository.findById(pacienteId)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente não encontrado com o ID: " + pacienteId));
        
        Profissional profissional = profissionalRepository.findById(profissionalId)
                .orElseThrow(() -> new ResourceNotFoundException("Profissional não encontrado com o ID: " + profissionalId));

        if (atendimento.getDataHoraAtendimento().isBefore(LocalDateTime.now())) {
            throw new BusinessRuleException("Não é possível agendar uma consulta em uma data passada.");
        }
        
        // Verifica se já existe um agendamento para o mesmo profissional em um intervalo de 1 hora
        LocalDateTime inicioJanela = atendimento.getDataHoraAtendimento().minusMinutes(59);
        LocalDateTime fimJanela = atendimento.getDataHoraAtendimento().plusMinutes(59);
        var conflitos = atendimentoRepository.findByProfissionalIdAndDataHoraAtendimentoBetween(profissionalId, inicioJanela, fimJanela);
        
        if (!conflitos.isEmpty()) {
            throw new BusinessRuleException("O profissional já possui um atendimento neste horário.");
        }

        atendimento.setPaciente(paciente);
        atendimento.setProfissional(profissional);
        atendimento.setStatus(EStatus.AGENDADO);
        
        return atendimentoRepository.save(atendimento);
    }
    
    @Transactional
    public Atendimento cancelarConsulta(Long atendimentoId) {
        Atendimento atendimento = atendimentoRepository.findById(atendimentoId)
                .orElseThrow(() -> new ResourceNotFoundException("Atendimento não encontrado com o ID: " + atendimentoId));
        
        if (atendimento.getStatus() == EStatus.ENCERRADO || atendimento.getStatus() == EStatus.CANCELADO) {
            throw new BusinessRuleException("Este atendimento não pode mais ser cancelado.");
        }
        
        atendimento.setStatus(EStatus.CANCELADO);
        return atendimentoRepository.save(atendimento);
    }
}