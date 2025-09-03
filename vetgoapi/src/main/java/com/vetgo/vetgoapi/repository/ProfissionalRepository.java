package com.vetgo.vetgoapi.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vetgo.vetgoapi.model.Profissional;
import com.vetgo.vetgoapi.model.Usuario;

@Repository
public interface ProfissionalRepository extends JpaRepository<Profissional, Long> {
    Optional<Profissional> findByUsuario(Usuario usuario);
}