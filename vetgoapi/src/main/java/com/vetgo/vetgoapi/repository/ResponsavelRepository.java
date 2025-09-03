package com.vetgo.vetgoapi.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vetgo.vetgoapi.model.Responsavel;
import com.vetgo.vetgoapi.model.Usuario;

@Repository
public interface ResponsavelRepository extends JpaRepository<Responsavel, Long> {
    
    // Método para encontrar um Responsavel com base no telefone do Usuario
    Optional<Responsavel> findByUsuario_Telefone(String telefone);

    // Método para encontrar um Responsavel pelo seu objeto Usuario
    Optional<Responsavel> findByUsuario(Usuario usuario);
    
    // Método para buscar um responsável pelo ID do usuário
    Optional<Responsavel> findByUsuarioId(Long usuarioId);
}