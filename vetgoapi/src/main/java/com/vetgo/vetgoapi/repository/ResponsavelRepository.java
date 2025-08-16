package com.vetgo.vetgoapi.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.vetgo.vetgoapi.model.Responsavel;
import com.vetgo.vetgoapi.model.Usuario;

@Repository
public interface ResponsavelRepository extends JpaRepository<Responsavel, Long> {
    
    // Método corrigido para encontrar um Responsavel com base no telefone do Usuario
    @Query("SELECT r FROM Responsavel r JOIN r.usuario u WHERE u.telefone = :telefone")
    Optional<Responsavel> buscaPorTelefone(@Param("telefone") String telefone);

    // Método para encontrar um Responsavel pelo seu objeto Usuario
    Optional<Responsavel> findByUsuario(Usuario usuario);
}