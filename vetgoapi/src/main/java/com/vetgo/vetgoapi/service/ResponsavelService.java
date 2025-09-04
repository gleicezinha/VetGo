package com.vetgo.vetgoapi.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vetgo.vetgoapi.model.Responsavel;
import com.vetgo.vetgoapi.model.Usuario;
import com.vetgo.vetgoapi.repository.ResponsavelRepository;
import com.vetgo.vetgoapi.repository.UsuarioRepository;
import com.vetgo.vetgoapi.service.exception.ResourceNotFoundException;

@Service
public class ResponsavelService implements ICrudService<Responsavel> {

    private final ResponsavelRepository responsavelRepository;
    private final UsuarioRepository usuarioRepository;

    public ResponsavelService(ResponsavelRepository responsavelRepository, UsuarioRepository usuarioRepository) {
        this.responsavelRepository = responsavelRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public List<Responsavel> get(String termoBusca) {
        return responsavelRepository.findAll();
    }

    @Override
    public Responsavel get(Long id) {
        return responsavelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Responsável não encontrado com o ID: " + id));
    }

    // LÓGICA CORRIGIDA E MAIS SEGURA
    public Optional<Responsavel> getByUsuarioId(Long usuarioId) {
        // Primeiro, buscamos o usuário.
        Optional<Usuario> usuario = usuarioRepository.findById(usuarioId);
        
        // Se o usuário existir e tiver o papel de Responsável, buscamos o perfil correspondente.
        if (usuario.isPresent() && usuario.get().getPapel().toString().equals("ROLE_RESPONSAVEL")) {
             return responsavelRepository.findByUsuario(usuario.get());
        }
        
        // Caso contrário, retornamos um Optional vazio.
        return Optional.empty();
    }
    
    @Override
    @Transactional
    public Responsavel save(Responsavel objeto) {
        if(objeto.getId() == null) {
            return responsavelRepository.save(objeto);
        } else {
            Responsavel responsavelExistente = this.get(objeto.getId());
            if (responsavelExistente != null && responsavelExistente.getUsuario() != null) {
                Usuario usuarioExistente = responsavelExistente.getUsuario();
                Usuario usuarioAtualizado = objeto.getUsuario();
                
                if (usuarioAtualizado != null) {
                    usuarioExistente.setNomeUsuario(usuarioAtualizado.getNomeUsuario());
                    usuarioExistente.setTelefone(usuarioAtualizado.getTelefone());
                    return responsavelRepository.save(responsavelExistente);
                } else {
                    throw new IllegalArgumentException("Objeto Usuario não pode ser nulo para a atualização.");
                }
            } else {
                throw new ResourceNotFoundException("Responsável não encontrado para atualização.");
            }
        }
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!responsavelRepository.existsById(id)) {
            throw new ResourceNotFoundException("Responsável não encontrado com o ID: " + id);
        }
        responsavelRepository.deleteById(id);
    }
    
    public Optional<Responsavel> getByTelefone(String telefone) {
        return responsavelRepository.findByUsuario_Telefone(telefone);
    }
}