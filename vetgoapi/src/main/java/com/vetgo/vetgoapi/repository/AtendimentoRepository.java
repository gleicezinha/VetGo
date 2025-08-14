package com.vetgo.vetgoapi.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vetgo.vetgoapi.model.Atendimento;

@Repository
public interface AtendimentoRepository extends JpaRepository<Atendimento, Long> {

    /**
     * Encontra todos os atendimentos de um determinado paciente.
     * @param pacienteId O ID do paciente.
     * @return Uma lista de atendimentos do paciente.
     */
    List<Atendimento> findByPacienteId(Long pacienteId);

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
}