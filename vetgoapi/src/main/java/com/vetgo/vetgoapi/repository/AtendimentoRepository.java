package com.vetgo.vetgoapi.repository;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.vetgo.vetgoapi.model.Atendimento;
import com.vetgo.vetgoapi.model.EStatus;

@Repository
public interface AtendimentoRepository extends JpaRepository<Atendimento, Long> {

    @Query("SELECT a FROM Atendimento a " +
           "JOIN FETCH a.paciente p " +
           "JOIN FETCH a.profissional prof " +
           "WHERE a.paciente.id = :pacienteId")
    List<Atendimento> findByPacienteIdWithDetails(@Param("pacienteId") Long pacienteId);

    List<Atendimento> findByProfissionalId(Long profissionalId);

    List<Atendimento> findByProfissionalIdAndDataHoraAtendimentoBetween(Long profissionalId, LocalDateTime start, LocalDateTime end);

    @Query("SELECT a FROM Atendimento a " +
           "JOIN FETCH a.paciente p " +
           "JOIN FETCH p.responsavel r " +
           "JOIN FETCH a.profissional " +
           "WHERE a.id = :id")
    Optional<Atendimento> findByIdWithDetails(@Param("id") Long id);
      @Query("SELECT a FROM Atendimento a LEFT JOIN FETCH a.paciente p LEFT JOIN FETCH p.responsavel r LEFT JOIN FETCH a.profissional WHERE a.id = :id")
    Optional<Atendimento> findByIdWithDependencies(@Param("id") Long id);

    @Query("SELECT a FROM Atendimento a JOIN a.paciente p JOIN p.responsavel r WHERE r.id = :responsavelId")
    List<Atendimento> findByResponsavelId(@Param("responsavelId") Long responsavelId);

    List<Atendimento> findByPacienteId(Long pacienteId);
    
    // MÉTODO DA NOTIFICAÇÃO (SINTAXE CORRIGIDA)
    List<Atendimento> findAllByDataHoraAtendimentoBetweenAndStatusIn(
        LocalDateTime start, 
        LocalDateTime end, 
        Collection<EStatus> statuses
    );
    
    // MÉTODO DO FILTRO (COM PAGINAÇÃO)
    @Query(value = "SELECT a FROM Atendimento a " +
           "JOIN FETCH a.paciente p " +
           "JOIN FETCH p.responsavel r " +
           "JOIN FETCH r.usuario rU " +
           "JOIN FETCH a.profissional prof " +
           "JOIN FETCH prof.usuario profU " +
           "WHERE (:termoBusca IS NULL OR :termoBusca = '') OR " +
           "LOWER(p.nome) LIKE %:termoBusca% OR " +
           "LOWER(rU.nomeUsuario) LIKE %:termoBusca% OR " +
           "LOWER(profU.nomeUsuario) LIKE %:termoBusca% OR " +
           "LOWER(a.status) LIKE %:termoBusca% OR " +
           "LOWER(a.tipoDeAtendimento) LIKE %:termoBusca%",
           countQuery = "SELECT count(a) FROM Atendimento a " + 
                        "LEFT JOIN a.paciente p " +
                        "LEFT JOIN p.responsavel r " +
                        "LEFT JOIN r.usuario rU " +
                        "LEFT JOIN a.profissional prof " +
                        "LEFT JOIN prof.usuario profU " +
                        "WHERE (:termoBusca IS NULL OR :termoBusca = '') OR " +
                        "LOWER(p.nome) LIKE %:termoBusca% OR " +
                        "LOWER(rU.nomeUsuario) LIKE %:termoBusca% OR " +
                        "LOWER(profU.nomeUsuario) LIKE %:termoBusca% OR " +
                        "LOWER(a.status) LIKE %:termoBusca% OR " +
                        "LOWER(a.tipoDeAtendimento) LIKE %:termoBusca%")
    Page<Atendimento> searchAllWithDetails(@Param("termoBusca") String termoBusca, Pageable pageable);
    
}