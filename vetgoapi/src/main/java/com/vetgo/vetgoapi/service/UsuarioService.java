package com.vetgo.vetgoapi.service;


import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vetgo.vetgoapi.model.Usuario;
import com.vetgo.vetgoapi.repository.UsuarioRepository;


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
        Usuario registro = repo.findById(id).orElse(null);
        return registro;
    }
    @Override
    public Usuario save(Usuario objeto) {
        Optional<Usuario> usuarioExistente = repo.findById(objeto.getId());
        if (usuarioExistente.isPresent()) {
            Usuario usuarioAtualizado = usuarioExistente.get();
            usuarioAtualizado.setNomeUsuario(objeto.getNomeUsuario());
            usuarioAtualizado.setTelefone(objeto.getTelefone());
            return repo.save(usuarioAtualizado);
        } else {
            return repo.save(objeto);
        }
    }

    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }

}