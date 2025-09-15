package com.vetgo.vetgoapi.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vetgo.vetgoapi.controller.dto.AgendamentoRequestDTO;
import com.vetgo.vetgoapi.controller.dto.AtendimentoResponseDTO;
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

    // NOVO MÉTODO PARA BUSCAR HORÁRIOS OCUPADOS
    public List<String> getHorariosOcupados(Long profissionalId, LocalDate data) {
        LocalDateTime inicioDoDia = data.atStartOfDay();
        LocalDateTime fimDoDia = data.atTime(LocalTime.MAX);
        
        List<Atendimento> atendimentosDoDia = atendimentoRepository.findByProfissionalIdAndDataHoraAtendimentoBetween(
            profissionalId, inicioDoDia, fimDoDia);

        return atendimentosDoDia.stream()
            .map(atendimento -> atendimento.getDataHoraAtendimento().toLocalTime().toString())
            .collect(Collectors.toList());
    }

    @Transactional
    public Atendimento agendarConsulta(AgendamentoRequestDTO dto) {
        Paciente paciente = pacienteRepository.findById(dto.getPacienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Paciente não encontrado com o ID: " + dto.getPacienteId()));
        
        Profissional profissional = profissionalRepository.findById(dto.getProfissionalId())
                .orElseThrow(() -> new ResourceNotFoundException("Profissional não encontrado com o ID: " + dto.getProfissionalId()));

        if (dto.getDataHoraAtendimento().isBefore(LocalDateTime.now())) {
            throw new BusinessRuleException("Não é possível agendar uma consulta em uma data passada.");
        }
        
        LocalDateTime inicioJanela = dto.getDataHoraAtendimento().minusMinutes(59);
        LocalDateTime fimJanela = dto.getDataHoraAtendimento().plusMinutes(59);
        var conflitos = atendimentoRepository.findByProfissionalIdAndDataHoraAtendimentoBetween(dto.getProfissionalId(), inicioJanela, fimJanela);
        
        if (!conflitos.isEmpty()) {
            throw new BusinessRuleException("O profissional já possui um atendimento neste horário.");
        }

        Atendimento atendimento = new Atendimento();
        atendimento.setPaciente(paciente);
        atendimento.setProfissional(profissional);
        atendimento.setDataHoraAtendimento(dto.getDataHoraAtendimento());
        atendimento.setTipoDeAtendimento(dto.getTipoDeAtendimento());
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

    // Método para salvar e atualizar um atendimento
    @Transactional
    public Atendimento save(Atendimento objeto) {
        return atendimentoRepository.save(objeto);
    }

    // Método para excluir um atendimento por ID
    @Transactional
    public void delete(Long id) {
        atendimentoRepository.deleteById(id);
    }

    public List<AtendimentoResponseDTO> getAllAtendimentos() {
        return atendimentoRepository.findAll().stream()
                .map(AtendimentoResponseDTO::new)
                .collect(Collectors.toList());
    }
    
    // APROVAÇÃO: O método agora chama a nova consulta do repositório
    public Atendimento getAtendimentoCompleto(Long id) {
        return atendimentoRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Atendimento não encontrado com o ID: " + id));
    }
}