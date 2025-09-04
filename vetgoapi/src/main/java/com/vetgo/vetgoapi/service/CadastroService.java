package com.vetgo.vetgoapi.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vetgo.vetgoapi.model.Profissional;
import com.vetgo.vetgoapi.model.Responsavel;
import com.vetgo.vetgoapi.model.Usuario;
import com.vetgo.vetgoapi.repository.ProfissionalRepository;
import com.vetgo.vetgoapi.repository.ResponsavelRepository;
import com.vetgo.vetgoapi.repository.UsuarioRepository;
import com.vetgo.vetgoapi.service.exception.BusinessRuleException;

@Service
public class CadastroService {

    private final UsuarioRepository usuarioRepository;
    private final ResponsavelRepository responsavelRepository;
    private final ProfissionalRepository profissionalRepository;

    public CadastroService(UsuarioRepository usuarioRepository, 
                           ResponsavelRepository responsavelRepository,
                           ProfissionalRepository profissionalRepository) {
        this.usuarioRepository = usuarioRepository;
        this.responsavelRepository = responsavelRepository;
        this.profissionalRepository = profissionalRepository;
    }

    @Transactional
    public Responsavel cadastrarTutor(Usuario usuario) {
        validarNovoUsuario(usuario);
        
        Usuario novoUsuario = usuarioRepository.save(usuario);

        Responsavel responsavel = new Responsavel();
        responsavel.setUsuario(novoUsuario);
        
        return responsavelRepository.save(responsavel);
    }

    @Transactional
    public Profissional cadastrarProfissional(Profissional profissional) {
        Usuario usuario = profissional.getUsuario();
        validarNovoUsuario(usuario);
        
        usuarioRepository.save(usuario);
        return profissionalRepository.save(profissional);
    }
    
    private void validarNovoUsuario(Usuario usuario) {
        usuarioRepository.findByEmail(usuario.getEmail()).ifPresent(u -> {
            throw new BusinessRuleException("O e-mail informado já está em uso.");
        });
        usuarioRepository.findByCpf(usuario.getCpf()).ifPresent(u -> {
            throw new BusinessRuleException("O CPF informado já está em uso.");
        });
    }
}