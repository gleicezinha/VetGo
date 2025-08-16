package com.vetgo.vetgoapi.repository;

import com.vetgo.vetgoapi.model.Responsavel;
import com.vetgo.vetgoapi.model.Usuario;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResponsavelRepository extends JpaRepository<Responsavel, Long> {
    
    // Este método é necessário para encontrar o Responsável a partir do Usuario.
    Optional<Responsavel> findByUsuario(Usuario usuario);
}