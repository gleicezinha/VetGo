// src/main/java/com/vetgo/vetgoapi/repository/AtendimentoRepository.java

package com.vetgo.vetgoapi.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.vetgo.vetgoapi.model.Atendimento;

@Repository
public interface AtendimentoRepository extends JpaRepository<Atendimento, Long> {

    /**
     * Encontra todos os atendimentos de um determinado paciente.
     * @param pacienteId O ID do paciente.
     * @return Uma lista de atendimentos do paciente.
     */
    @Query("SELECT a FROM Atendimento a " +
           "JOIN FETCH a.paciente p " +
           "JOIN FETCH a.profissional prof " +
           "WHERE a.paciente.id = :pacienteId")
    List<Atendimento> findByPacienteIdWithDetails(@Param("pacienteId") Long pacienteId);

    /**
     * Encontra todos os atendimentos realizados por um determinado profissional.
     * @param profissionalId O ID do profissional.
     * @return Uma lista de atendimentos do profissional.
     */
    List<Atendimento> findByProfissionalId(Long profissionalId);

    /**
     * Encontra todos os atendimentos de um profissional dentro de um intervalo de datas.
     * @param profissionalId O ID do profissional.
     * @param start A data e hora de início.
     * @param end A data e hora de fim.
     * @return Uma lista de atendimentos para a agenda do profissional.
     */
    List<Atendimento> findByProfissionalIdAndDataHoraAtendimentoBetween(Long profissionalId, LocalDateTime start, LocalDateTime end);

    /**
     * Encontra um atendimento por ID e carrega de forma ansiosa
     * (eagerly) todos os seus relacionamentos.
     * @param id O ID do atendimento.
     * @return Um Optional contendo o atendimento completo.
     */
    @Query("SELECT a FROM Atendimento a " +
           "JOIN FETCH a.paciente p " +
           "JOIN FETCH p.responsavel r " +
           "JOIN FETCH a.profissional " +
           "WHERE a.id = :id")
    Optional<Atendimento> findByIdWithDetails(@Param("id") Long id);
}