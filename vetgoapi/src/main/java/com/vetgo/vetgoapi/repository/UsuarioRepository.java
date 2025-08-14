package com.vetgo.vetgoapi.repository;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vetgo.vetgoapi.model.Usuario;

@Repository 
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    /**
     * Busca um usuário pelo seu endereço de e-mail.
     * O Spring Data JPA cria a consulta automaticamente a partir do nome do método.
     * @param email O e-mail a ser pesquisado.
     * @return um Optional contendo o usuário se encontrado, ou vazio caso contrário.
     */
    Optional<Usuario> findByEmail(String email);

    /**

     * @param cpf O CPF a ser pesquisado.
     * @return um Optional contendo o usuário se encontrado, ou vazio caso contrário.
     */
    Optional<Usuario> findByCpf(String cpf);
}