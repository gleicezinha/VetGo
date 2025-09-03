package com.vetgo.vetgoapi.controller;

import com.vetgo.vetgoapi.model.Usuario;
import com.vetgo.vetgoapi.service.UsuarioService;
import com.vetgo.vetgoapi.service.exception.ResourceNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/login")
@CrossOrigin(origins = "http://localhost:4200") // Adicione se necessário, embora já esteja na WebConfig
public class LoginController {

    private final UsuarioService usuarioService;

    public LoginController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/contato")
    public ResponseEntity<Usuario> loginComContato(@RequestBody Usuario usuario) {
        Usuario usuarioEncontrado = usuarioService.getByTelefone(usuario.getTelefone())
                .orElseThrow(() -> new ResourceNotFoundException("Contato não cadastrado."));
        return ResponseEntity.ok(usuarioEncontrado);
    }
}