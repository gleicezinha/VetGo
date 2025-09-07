package com.vetgo.vetgoapi.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.vetgo.vetgoapi.controller.dto.PhoneRequest;
import com.vetgo.vetgoapi.controller.dto.VerifyRequest;
import com.vetgo.vetgoapi.model.EPapel;
import com.vetgo.vetgoapi.model.Usuario;
import com.vetgo.vetgoapi.repository.ProfissionalRepository;
import com.vetgo.vetgoapi.repository.ResponsavelRepository;
import com.vetgo.vetgoapi.service.UsuarioService;
import com.vetgo.vetgoapi.service.WhapiService;
import com.vetgo.vetgoapi.service.exception.ResourceNotFoundException;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final WhapiService whapiService;
    private final UsuarioService usuarioService;
    private final ResponsavelRepository responsavelRepository;
    private final ProfissionalRepository profissionalRepository;

    public AuthController(WhapiService whapiService, UsuarioService usuarioService,
                          ResponsavelRepository responsavelRepository,
                          ProfissionalRepository profissionalRepository) {
        this.whapiService = whapiService;
        this.usuarioService = usuarioService;
        this.responsavelRepository = responsavelRepository;
        this.profissionalRepository = profissionalRepository;
    }

@PostMapping("/send-code")
public ResponseEntity<?> sendCode(@RequestBody PhoneRequest request) {
    String status = whapiService.sendCode(request.getPhone());
    // Retorne um objeto JSON para que o front-end possa interpretar a resposta
    Map<String, String> response = new HashMap<>();
    response.put("status", status);
    return ResponseEntity.ok(response);
}
    @PostMapping("/verify-code")
    public ResponseEntity<?> verifyCode(@RequestBody VerifyRequest request) {
        // Normaliza telefone
        String telefone = request.getPhone().replaceAll("\\D", "");

        String whapiStatus = whapiService.verifyCode(telefone, request.getCode());

        if (!"approved".equals(whapiStatus)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Código de verificação inválido.");
        }

        // Se o código foi aprovado, busca ou cria o usuário
        Usuario usuario = usuarioService.getByTelefone(telefone)
                .orElseGet(() -> {
                    Usuario novo = new Usuario();
                    novo.setTelefone(telefone);
                    novo.setPapel(EPapel.ROLE_RESPONSAVEL); // ajuste conforme regra do sistema
                    return usuarioService.save(novo);
                });

        // Busca o perfil relacionado
        if (usuario.getPapel() == EPapel.ROLE_RESPONSAVEL) {
            return responsavelRepository.findByUsuario(usuario)
                    .<ResponseEntity<?>>map(ResponseEntity::ok)
                    .orElse(ResponseEntity.ok(usuario)); // retorna apenas o usuário se perfil não existir
        } else if (usuario.getPapel() == EPapel.ROLE_PROFISSIONAL) {
            return profissionalRepository.findByUsuario(usuario)
                    .<ResponseEntity<?>>map(ResponseEntity::ok)
                    .orElse(ResponseEntity.ok(usuario));
        }

        return ResponseEntity.ok(usuario);
    }
}
