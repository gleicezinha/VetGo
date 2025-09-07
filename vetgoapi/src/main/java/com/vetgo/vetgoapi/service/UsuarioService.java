package com.vetgo.vetgoapi.service;

import java.util.List;
import java.util.Optional; // Importe esta classe

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.vetgo.vetgoapi.model.Usuario;
import com.vetgo.vetgoapi.repository.UsuarioRepository;
import com.vetgo.vetgoapi.service.exception.ResourceNotFoundException;

@Service
public class UsuarioService implements ICrudService<Usuario> {

    @Autowired
    private UsuarioRepository repo;

    @Override
    public List<Usuario> get(String termoBusca) {
        List<Usuario> registros = repo.busca(termoBusca);
        return registros;
    }

    @Override
    public Usuario get(Long id) {
        return repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));
    }

    public Optional<Usuario> getByTelefone(String telefone) {
        return repo.findByTelefone(telefone);
    }

    @Override
    public Usuario save(Usuario objeto) {
        // Lógica de atualização ou inserção
        if (objeto.getId() != null) {
            Usuario usuarioExistente = this.get(objeto.getId());
            usuarioExistente.setNomeUsuario(objeto.getNomeUsuario());
            usuarioExistente.setTelefone(objeto.getTelefone());
            // ... adicione outros campos a serem atualizados
            return repo.save(usuarioExistente);
        } else {
            return repo.save(objeto);
        }
    }

    @Override
    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new ResourceNotFoundException("Usuário não encontrado com o ID: " + id);
        }
        repo.deleteById(id);
    }
}