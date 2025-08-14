package com.vetgo.vetgoapi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vetgo.vetgoapi.model.Procedimento;

@Repository
public interface ProcedimentoRepository extends JpaRepository<Procedimento, Long> {

    /**
     * Encontra todos os procedimentos realizados durante um atendimento específico.
     * @param atendimentoId O ID do atendimento.
     * @return Uma lista de procedimentos.
     */
    List<Procedimento> findByAtendimentoId(Long atendimentoId);
}
