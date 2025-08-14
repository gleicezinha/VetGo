package com.vetgo.vetgoapi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vetgo.vetgoapi.model.HistoricoClinico;

@Repository
public interface HistoricoClinicoRepository extends JpaRepository<HistoricoClinico, Long> {

    /**
     * Encontra todas as entradas do histórico clínico de um paciente, ordenadas pela data mais recente primeiro.
     * @param pacienteId O ID do paciente.
     * @return Uma lista ordenada do histórico clínico.
     */
    List<HistoricoClinico> findByPacienteIdOrderByDataDesc(Long pacienteId);
}