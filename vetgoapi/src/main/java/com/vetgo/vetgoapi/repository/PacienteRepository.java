package com.vetgo.vetgoapi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vetgo.vetgoapi.model.Paciente;

@Repository
public interface PacienteRepository extends JpaRepository<Paciente, Long> {

    /**
     * Encontra todos os pacientes associados a um determinado responsável (tutor).
     * @param responsavelId O ID do responsável.
     * @return Uma lista de pacientes pertencentes ao responsável.
     */
    List<Paciente> findByResponsavelId(Long responsavelId);
}