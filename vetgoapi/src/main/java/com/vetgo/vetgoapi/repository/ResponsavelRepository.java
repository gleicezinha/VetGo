package com.vetgo.vetgoapi.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.vetgo.vetgoapi.model.Paciente;
import com.vetgo.vetgoapi.model.Responsavel;
import com.vetgo.vetgoapi.model.Usuario;

@Repository
public interface ResponsavelRepository extends JpaRepository<Responsavel, Long> {
    @Query(
        "SELECT r from Responsavel r " +
        "WHERE (:termoBusca IS NULL OR r.nomeCompleto LIKE %:termoBusca%) " +
        "AND (:termoBusca IS NULL OR r.telefone LIKE %:termoBusca%) "
    )
    List<Responsavel> busca(String termoBusca);
    @Query(
        "SELECT r from Responsavel r " +
        "WHERE r.telefone = :telefone "
    )
    Responsavel buscaPorTelefone(String telefone);
}