package com.vetgo.vetgoapi.service;

import com.vetgo.vetgoapi.model.HistoricoClinico;
import com.vetgo.vetgoapi.model.Paciente;
import com.vetgo.vetgoapi.model.Responsavel;
import com.vetgo.vetgoapi.repository.HistoricoClinicoRepository;
import com.vetgo.vetgoapi.repository.PacienteRepository;
import com.vetgo.vetgoapi.repository.ResponsavelRepository;
import com.vetgo.vetgoapi.service.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;

@Service
public class PacienteService {

    private final PacienteRepository pacienteRepository;
    private final ResponsavelRepository responsavelRepository;
    private final HistoricoClinicoRepository historicoClinicoRepository;

    public PacienteService(PacienteRepository pacienteRepository, ResponsavelRepository responsavelRepository, HistoricoClinicoRepository historicoClinicoRepository) {
        this.pacienteRepository = pacienteRepository;
        this.responsavelRepository = responsavelRepository;
        this.historicoClinicoRepository = historicoClinicoRepository;
    }

    /**
     * Registra um novo paciente e o associa a um responsável existente.
     * @param paciente O objeto do paciente a ser salvo.
     * @param idResponsavel O ID do responsável (tutor).
     * @return O paciente salvo.
     */
    @Transactional
    public Paciente registrarNovoPaciente(Paciente paciente, Long idResponsavel) {
        Responsavel responsavel = responsavelRepository.findById(idResponsavel)
                .orElseThrow(() -> new ResourceNotFoundException("Responsável (tutor) não encontrado com o ID: " + idResponsavel));
        
        paciente.setResponsavel(responsavel);
        return pacienteRepository.save(paciente);
    }
    
    /**
     * Busca um paciente pelo seu ID.
     * @param id O ID do paciente.
     * @return O paciente encontrado.
     * @throws ResourceNotFoundException se o paciente não for encontrado.
     */
    public Paciente buscarPorId(Long id) {
        return pacienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente não encontrado com o ID: " + id));
    }
    
    /**
     * Lista todos os pacientes de um determinado tutor.
     * @param idResponsavel O ID do responsável (tutor).
     * @return Uma lista de pacientes.
     */
    public List<Paciente> listarPacientesPorTutor(Long idResponsavel) {
        return pacienteRepository.findByResponsavelId(idResponsavel);
    }

    /**
     * Adiciona uma nova entrada ao histórico clínico de um paciente.
     * @param pacienteId O ID do paciente.
     * @param descricao A descrição do evento clínico.
     * @param observacoes Observações adicionais.
     * @return A entrada do histórico clínico salva.
     */
    @Transactional
    public HistoricoClinico adicionarEntradaHistorico(Long pacienteId, String descricao, String observacoes) {
        Paciente paciente = buscarPorId(pacienteId);

        HistoricoClinico entrada = new HistoricoClinico();
        entrada.setPaciente(paciente);
        entrada.setData(LocalDate.now());
        entrada.setDescricao(descricao);
        entrada.setObservacoes(observacoes);

        return historicoClinicoRepository.save(entrada);
    }
    
    /**
     * Retorna o histórico clínico completo de um paciente, ordenado por data decrescente.
     * @param pacienteId O ID do paciente.
     * @return A lista de entradas do histórico.
     */
    public List<HistoricoClinico> verHistoricoCompleto(Long pacienteId) {
        // Valida se o paciente existe antes de buscar o histórico
        buscarPorId(pacienteId); 
        return historicoClinicoRepository.findByPacienteIdOrderByDataDesc(pacienteId);
    }
}