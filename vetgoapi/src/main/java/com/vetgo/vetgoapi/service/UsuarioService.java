package com.vetgo.vetgoapi.service;

import java.util.List;

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
      if (objeto.getId() != null) {
            Usuario existente = repo.findById(objeto.getId()).orElse(null);
            if (existente != null) {
                existente.setNomeUsuario(objeto.getNomeUsuario());
                existente.setTelefone(objeto.getTelefone());
                existente.setPapel(objeto.getPapel());
                return repo.save(existente);
            }
        }
        return repo.save(objeto);

    }

    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }
    public Usuario buscaPorTelefone(String telefone) {
        Usuario registro = repo.buscaPorTelefone(telefone);
        return registro;
    }
}