package com.vetgo.vetgoapi.configuration;
import java.util.Arrays;
import java.util.Collection;


import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.vetgo.vetgoapi.model.Usuario;


public class PerfilUsuario implements UserDetails {

    private final Usuario usuario;

    public PerfilUsuario(Usuario usuario){
        this.usuario = usuario;
    }


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        var auth = new SimpleGrantedAuthority(usuario.getPapel().name());
        return Arrays.asList(auth);
    }


    @Override
    public String getUsername() {
        return usuario.getNomeUsuario();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return usuario.isAtivo();
    }

    public String getTelefone() {
        return usuario.getTelefone();
    }

    @Override
    public String getPassword() {
        return null;
    }
    
}
