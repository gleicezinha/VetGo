package com.vetgo.vetgoapi.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.vetgo.vetgoapi.model.Paciente;
import com.vetgo.vetgoapi.repository.PacienteRepository;
import com.vetgo.vetgoapi.service.exception.ResourceNotFoundException;

@Service
public class PacienteService implements ICrudService<Paciente> {

    private final PacienteRepository pacienteRepository;

    public PacienteService(PacienteRepository pacienteRepository) {
        this.pacienteRepository = pacienteRepository;
    }

    @Override
    public List<Paciente> get(String termoBusca) {
        if (termoBusca != null && !termoBusca.isEmpty()) {
            return pacienteRepository.findByNomeContainingIgnoreCase(termoBusca);
        }
        return pacienteRepository.findAll();
    }
    
    @Override
    public Paciente get(Long id) {
        return pacienteRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Paciente não encontrado com o ID: " + id));
    }
    
    public List<Paciente> listarPacientesPorTutor(Long idResponsavel) {
        return pacienteRepository.findByResponsavelId(idResponsavel);
    }

    @Override
    public Paciente save(Paciente paciente) {
        return pacienteRepository.save(paciente);
    }
    
    @Override
    public void delete(Long id) {
        pacienteRepository.deleteById(id);
    }

    public Object getPacientesByResponsavelId(Long idResponsavel) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getPacientesByResponsavelId'");
    }
}
