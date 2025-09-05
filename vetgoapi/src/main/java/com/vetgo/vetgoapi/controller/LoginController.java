package com.vetgo.vetgoapi.controller;

import com.auth0.jwt.JWT;
import com.vetgo.vetgoapi.configuration.PerfilUsuario;
import com.vetgo.vetgoapi.configuration.TokenService;
import com.vetgo.vetgoapi.model.Usuario;
import com.vetgo.vetgoapi.service.UsuarioService;
import com.vetgo.vetgoapi.service.exception.ResourceNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/login")
@CrossOrigin(origins = "http://localhost:4200") // Adicione se necessário, embora já esteja na WebConfig
public class LoginController {

    private final AuthenticationManager authManeger;
    private final UsuarioService usuarioService;
    private final TokenService tokenService;

    public LoginController(            AuthenticationManager authManager,
            UsuarioService usuarioService,
            TokenService tokenService) {
        this.authManeger = authManager;
        this.usuarioService = usuarioService;
        this.tokenService = tokenService;
            }

    @PostMapping("/autenticacao")
    public ResponseEntity<String> autenticar(@RequestBody Usuario usuario) {
        //System.out.println(usuario.getCpf());
        var loginToken = new UsernamePasswordAuthenticationToken(usuario.getTelefone(), usuario.getSenha());
        var auth = authManeger.authenticate(loginToken);
        PerfilUsuario principal = (PerfilUsuario) auth.getPrincipal();
        Usuario usuarioAutenticado = usuarioService.buscaPorTelefone(principal.getTelefone());
        var token = tokenService.criarToken(usuarioAutenticado);
        return ResponseEntity.ok(token);
    }

    @GetMapping("/renovar")
    public ResponseEntity<String> renovar (@RequestHeader("Authorization") String authHeader) {
        
        var token = authHeader.replace("Bearer ", "");
        var tokenDecodificado = JWT.decode(token);

        if (tokenService.isDataLimiteExpirada(tokenDecodificado)) {
            var mensagem = "Data limite de renovação expirada";
            return ResponseEntity.badRequest().body(mensagem);
        }

        var telefone = tokenDecodificado.getSubject();
        var usuario = usuarioService.buscaPorTelefone(telefone);
        var tokenNovo = tokenService.criarToken(usuario);

        return ResponseEntity.ok(tokenNovo);
    }
}