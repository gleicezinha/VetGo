package com.vetgo.vetgoapi.configuration;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.vetgo.vetgoapi.service.UsuarioService;

@Service
public class PerfilUsuarioService implements UserDetailsService{

    private final UsuarioService servico;

    public PerfilUsuarioService(UsuarioService servico){
        this.servico = servico;
    }

    @Override
    public UserDetails loadUserByUsername(String telefone) throws UsernameNotFoundException {
        var usuario = servico.buscaPorTelefone(telefone);
        //System.out.println(cpf);
        if(usuario == null){
            //System.out.println("perfil service");
            throw new UsernameNotFoundException("Usuário não encontrado com o Telefone: " + telefone);
        }
        return new PerfilUsuario(usuario);
    }
    
}
