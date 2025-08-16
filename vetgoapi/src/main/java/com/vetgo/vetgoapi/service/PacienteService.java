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
public class PacienteService implements ICrudService<Paciente> {

    private final PacienteRepository pacienteRepository;
    private final ResponsavelRepository responsavelRepository;
    private final HistoricoClinicoRepository historicoClinicoRepository;

    public PacienteService(PacienteRepository pacienteRepository, ResponsavelRepository responsavelRepository, HistoricoClinicoRepository historicoClinicoRepository) {
        this.pacienteRepository = pacienteRepository;
        this.responsavelRepository = responsavelRepository;
        this.historicoClinicoRepository = historicoClinicoRepository;
    }

    /**
     * Implementação do método get() da interface ICrudService.
     * @param termoBusca Termo de busca (não utilizado aqui, retorna todos).
     * @return Uma lista de todos os pacientes.
     */
    @Override
    public List<Paciente> get(String termoBusca) {
        return pacienteRepository.findAll();
    }

    /**
     * Implementação do método get(id) da interface ICrudService.
     * @param id O ID do paciente.
     * @return O paciente encontrado.
     * @throws ResourceNotFoundException se o paciente não for encontrado.
     */
    @Override
    public Paciente get(Long id) {
        return pacienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente não encontrado com o ID: " + id));
    }

    /**
     * Implementação do método save() da interface ICrudService.
     * Este método é flexível para criar um novo ou atualizar um paciente.
     * Valida a existência de um Responsavel ao criar um novo Paciente.
     * @param paciente O objeto do paciente a ser salvo.
     * @return O paciente salvo.
     */
    @Override
    @Transactional
    public Paciente save(Paciente paciente) {
        if (paciente.getId() == null) {
            // Lógica para novo paciente: exige que um Responsável esteja associado.
            Responsavel responsavel = paciente.getResponsavel();
            if (responsavel == null || responsavel.getId() == null) {
                 throw new IllegalArgumentException("O paciente deve ter um responsável com ID válido.");
            }
            return pacienteRepository.save(paciente);
        } else {
            // Lógica para atualizar um paciente existente
            Paciente pacienteExistente = this.get(paciente.getId());
            pacienteExistente.setNome(paciente.getNome());
            pacienteExistente.setEspecie(paciente.getEspecie());
            pacienteExistente.setRaca(paciente.getRaca());
            pacienteExistente.setSexo(paciente.getSexo());
            pacienteExistente.setDataNascimento(paciente.getDataNascimento());
            pacienteExistente.setSituacao(paciente.getSituacao());
            return pacienteRepository.save(pacienteExistente);
        }
    }

    /**
     * Implementação do método delete() da interface ICrudService.
     * @param id O ID do paciente a ser deletado.
     */
    @Override
    @Transactional
    public void delete(Long id) {
        if (!pacienteRepository.existsById(id)) {
            throw new ResourceNotFoundException("Paciente não encontrado com o ID: " + id);
        }
        pacienteRepository.deleteById(id);
    }

    // Mantidos os outros métodos específicos, que não são da interface.
    
    public List<Paciente> listarPacientesPorTutor(Long idResponsavel) {
        return pacienteRepository.findByResponsavelId(idResponsavel);
    }

    @Transactional
    public HistoricoClinico adicionarEntradaHistorico(Long pacienteId, String descricao, String observacoes) {
        Paciente paciente = get(pacienteId);

        HistoricoClinico entrada = new HistoricoClinico();
        entrada.setPaciente(paciente);
        entrada.setData(LocalDate.now());
        entrada.setDescricao(descricao);
        entrada.setObservacoes(observacoes);

        return historicoClinicoRepository.save(entrada);
    }
    
    public List<HistoricoClinico> verHistoricoCompleto(Long pacienteId) {
        get(pacienteId); 
        return historicoClinicoRepository.findByPacienteIdOrderByDataDesc(pacienteId);
    }
}