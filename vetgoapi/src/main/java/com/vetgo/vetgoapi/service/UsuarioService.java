package com.vetgo.vetgoapi.service;


import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vetgo.vetgoapi.model.Usuario;
import com.vetgo.vetgoapi.repository.UsuarioRepository;


@Service
public class UsuarioService {
    
 
    private final UsuarioRepository usuarioRepository;

    @Autowired
    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public Optional<Usuario> buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

}