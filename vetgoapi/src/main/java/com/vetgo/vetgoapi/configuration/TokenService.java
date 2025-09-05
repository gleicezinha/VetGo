package com.vetgo.vetgoapi.configuration;


import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.vetgo.vetgoapi.model.Responsavel;
import com.vetgo.vetgoapi.model.Usuario;
import com.vetgo.vetgoapi.service.ResponsavelService;
import com.vetgo.vetgoapi.service.UsuarioService;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class TokenService {
    
    @Value("${jwt.secret}")
    private String secret;

    private final HttpServletRequest request;
    private final UsuarioService usuarioService;
    private final ResponsavelService responsavelService;

    public TokenService(HttpServletRequest request, UsuarioService usuarioService, ResponsavelService responsavelService){
        this.request = request;
        this.usuarioService = usuarioService;
        this.responsavelService = responsavelService;
    }

    private Instant gerarDataExpiracao(){
        var dateTime = LocalDateTime.now().plusHours(2);
        var zoneId = ZoneId.systemDefault();
        var zoneDateTime = dateTime.atZone(zoneId);
        return zoneDateTime.toInstant();
    }

    public String criarToken(Usuario usuario){
        var secret_crypt = Algorithm.HMAC256(secret);
        var token = JWT.create()
                    .withIssuer("VETGO  ")
                    .withSubject(usuario.getTelefone())
                    .withClaim("idUsuario", usuario.getId())
                    .withClaim("nomeCompleto", usuario.getNomeUsuario())
                    .withClaim("papel", usuario.getPapel().toString())
                    .withClaim("dataLimiteRenovacao", LocalDate.now().toString())
                    .withExpiresAt(gerarDataExpiracao())
                    .sign(secret_crypt);
        return token;
    }

    public boolean isDataLimiteExpirada(DecodedJWT tokenDecodificado){
        var claimDataLimite = tokenDecodificado.getClaim("dataLimiteRenovacao");
        var dataLimite = LocalDate.parse(claimDataLimite.asString());
        var hoje = LocalDate.now();
        return hoje.isAfter(dataLimite);
    }

    public String validarToken(String token){

        try{
            JWT.decode(token);
        } catch (JWTDecodeException e){
            return null;
        }

        var secret_crypt = Algorithm.HMAC256(secret);

        try {
            var tokenValido = JWT.require(secret_crypt)
                                .withIssuer("MEDAGENDA")
                                .build()
                                .verify(token);
            return tokenValido.getSubject();
        } catch (TokenExpiredException e){
            return null;
        }
    }

    public String PapelDoUsuarioAutenticado() {
        var auth = this.request.getHeader("Authorization");
        if (auth == null || !auth.startsWith("Bearer ")){
            return null;
        }
        auth = auth.replace("Bearer ", "");
        try {
            JWT.decode(auth);
        }
        catch (JWTDecodeException e){
            return null;
        }

        var secret_crypt = Algorithm.HMAC256(secret);

        try {
            var tokenDecodificado = JWT.require(secret_crypt)
                                .withIssuer("MEDAGENDA")
                                .build()
                                .verify(auth);
        
            Claim papelUsuarioClaim = tokenDecodificado.getClaim("papel");
            String papelUsuario = papelUsuarioClaim.asString();
            return papelUsuario;
        } catch (TokenExpiredException e) {
            return null;
        }
    }

    public Usuario getUsuarioAutenticado() {
        var auth = this.request.getHeader("Authorization");
        if (auth == null || !auth.startsWith("Bearer ")){
            return null;
        }
        auth = auth.replace("Bearer ", "");
        try {
            JWT.decode(auth);
        }
        catch (JWTDecodeException e){
            return null;
        }

        var secret_crypt = Algorithm.HMAC256(secret);

        try {
            var tokenDecodificado = JWT.require(secret_crypt)
                                .withIssuer("MEDAGENDA")
                                .build()
                                .verify(auth);
            Usuario user = usuarioService.buscaPorTelefone(tokenDecodificado.getSubject());
            return user;
        } catch (TokenExpiredException e) {
            return null;
        }
    }

    public Responsavel getResponsavel() {
        var auth = this.request.getHeader("Authorization");
        if (auth == null || !auth.startsWith("Bearer ")){
            return null;
        }
        auth = auth.replace("Bearer ", "");
        try {
            JWT.decode(auth);
        }
        catch (JWTDecodeException e){
            return null;
        }

        var secret_crypt = Algorithm.HMAC256(secret);

        try {
            var tokenDecodificado = JWT.require(secret_crypt)
                                .withIssuer("VETGO")
                                .build()
                                .verify(auth);
            Responsavel responsavel = responsavelService.getByTelefone(tokenDecodificado.getSubject());
            return responsavel;
        } catch (TokenExpiredException e) {
            return null;
        }
    }
}
