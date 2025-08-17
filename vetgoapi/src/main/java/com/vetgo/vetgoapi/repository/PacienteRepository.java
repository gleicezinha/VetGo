package com.vetgo.vetgoapi.repository;

import com.vetgo.vetgoapi.model.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PacienteRepository extends JpaRepository<Paciente, Long> {

    // Método de busca por nome, que foi adicionado.
    List<Paciente> findByNomeContainingIgnoreCase(String termoBusca);
    
    // Método para buscar pacientes pelo ID do responsável.
    List<Paciente> findByResponsavelId(Long idResponsavel);
}
