package com.vetgo.vetgoapi.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.vetgo.vetgoapi.model.Usuario;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    @Query("SELECT u FROM Usuario u WHERE u.nomeUsuario LIKE %:termoBusca% OR u.telefone LIKE %:termoBusca% OR u.cpf LIKE %:termoBusca%")
    List<Usuario> busca(@Param("termoBusca") String termoBusca);

    @Query("SELECT u FROM Usuario u WHERE u.telefone = :telefone")
    Usuario buscaPorTelefone(@Param("telefone") String telefone);

    Optional<Usuario> findByEmail(String email);
    Optional<Usuario> findByCpf(String cpf);
}