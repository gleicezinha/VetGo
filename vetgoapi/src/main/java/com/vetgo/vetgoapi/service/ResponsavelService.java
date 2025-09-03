package com.vetgo.vetgoapi.service;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service; // Novo import
import org.springframework.transaction.annotation.Transactional;

import com.vetgo.vetgoapi.model.Responsavel; // Novo import
import com.vetgo.vetgoapi.model.Usuario;
import com.vetgo.vetgoapi.repository.ProfissionalRepository;
import com.vetgo.vetgoapi.repository.ResponsavelRepository;
import com.vetgo.vetgoapi.repository.UsuarioRepository;
import com.vetgo.vetgoapi.service.exception.ResourceNotFoundException;

@Service
public class ResponsavelService implements ICrudService<Responsavel> {

    private final ResponsavelRepository responsavelRepository;
    private final ProfissionalRepository profissionalRepository; // Injetado
    private final UsuarioRepository usuarioRepository;

    public ResponsavelService(ResponsavelRepository responsavelRepository, UsuarioRepository usuarioRepository, ProfissionalRepository profissionalRepository) {
        this.responsavelRepository = responsavelRepository;
        this.usuarioRepository = usuarioRepository;
        this.profissionalRepository = profissionalRepository;
    }

    // ... outros métodos ...
    
    // Método para buscar um usuário pelo telefone e retornar o objeto de entidade específico
    public Optional<?> getByTelefone(String telefone) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByTelefone(telefone);

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            if (usuario.getPapel().toString().equals("ROLE_PROFISSIONAL") || usuario.getPapel().toString().equals("ROLE_ADMIN")) {
                return profissionalRepository.findByUsuario(usuario);
            } else if (usuario.getPapel().toString().equals("ROLE_RESPONSAVEL")) {
                return responsavelRepository.findByUsuario(usuario);
            }
        }
        return Optional.empty();
    }

    @Override
    public List<Responsavel> get(String termoBusca) {
        // Implementar lógica de busca por termo se necessário.
        return responsavelRepository.findAll();
    }

    @Override
    public Responsavel get(Long id) {
        return responsavelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Responsável não encontrado com o ID: " + id));
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
    
}