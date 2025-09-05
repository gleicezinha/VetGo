package com.vetgo.vetgoapi.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vetgo.vetgoapi.model.EPapel;
import com.vetgo.vetgoapi.model.Responsavel;
import com.vetgo.vetgoapi.model.Usuario;
import com.vetgo.vetgoapi.repository.ResponsavelRepository;


@Service
public class ResponsavelService implements ICrudService<Responsavel> {

    private final ResponsavelRepository repo;
    private final UsuarioService servicoUsuario;

    public ResponsavelService(ResponsavelRepository repo, UsuarioService servicoUsuario) {
        this.repo = repo;
        this.servicoUsuario = servicoUsuario;
    }

    @Override
    public List<Responsavel> get(String termoBusca) {
        List<Responsavel> registros = repo.busca(termoBusca);
        return registros;
    }

    @Override
    public Responsavel get(Long id) {
        Responsavel registro = repo.findById(id).orElse(null);
        return registro;
    }
    public Responsavel getByTelefone(String telefone){
        Responsavel registro = repo.buscaPorTelefone(telefone);
        return registro;
    }

    
    @Override
    @Transactional
    public Responsavel save(Responsavel objeto) {
        if (objeto.getUsuario() == null) {
            System.out.println("Salvando novo responsável");
            Usuario usuario = new Usuario();
            usuario.setNomeUsuario(objeto.getUsuario().getNomeUsuario());
            usuario.setTelefone(objeto.getUsuario().getTelefone());
            usuario.setPapel(EPapel.ROLE_RESPONSAVEL);
            servicoUsuario.save(usuario);
        
        } else {
            System.out.println("Atualizando responsável existente");
        }
        Responsavel registro = repo.save(objeto);
        return registro;
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Responsavel registro = this.get(id);
        Usuario usuario = servicoUsuario.buscaPorTelefone(registro.getTelefone());
        if (usuario != null){
            servicoUsuario.delete(usuario.getId());
        }
        repo.deleteById(id);
    }
    

}