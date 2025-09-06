package com.vetgo.vetgoapi.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vetgo.vetgoapi.controller.dto.PhoneRequest;
import com.vetgo.vetgoapi.controller.dto.VerifyRequest;
import com.vetgo.vetgoapi.model.EPapel; // <-- Importação adicionada
import com.vetgo.vetgoapi.repository.ProfissionalRepository;
import com.vetgo.vetgoapi.repository.ResponsavelRepository;
import com.vetgo.vetgoapi.service.TwilioService;
import com.vetgo.vetgoapi.service.UsuarioService;
import com.vetgo.vetgoapi.service.exception.ResourceNotFoundException;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final TwilioService twilioService;
    private final UsuarioService usuarioService;
    private final ResponsavelRepository responsavelRepository;
    private final ProfissionalRepository profissionalRepository;

    public AuthController(TwilioService twilioService, UsuarioService usuarioService, ResponsavelRepository responsavelRepository, ProfissionalRepository profissionalRepository) {
        this.twilioService = twilioService;
        this.usuarioService = usuarioService;
        this.responsavelRepository = responsavelRepository;
        this.profissionalRepository = profissionalRepository;
    }

    @PostMapping("/send-code")
    public ResponseEntity<String> sendCode(@RequestBody PhoneRequest request) {
        // Valida se o telefone existe antes de enviar o código
        usuarioService.getByTelefone(request.getPhone())
                .orElseThrow(() -> new ResourceNotFoundException("Telefone não cadastrado."));
        
        String status = twilioService.sendCode(request.getPhone());
        return ResponseEntity.ok(status);
    }

    @PostMapping("/verify-code")
    public ResponseEntity<?> verifyCode(@RequestBody VerifyRequest request) {
        String twilioStatus = twilioService.verifyCode(request.getPhone(), request.getCode());
        
        if ("approved".equals(twilioStatus)) {
            // Se o código for aprovado pelo Twilio, busque o usuário pelo telefone
            return usuarioService.getByTelefone(request.getPhone())
                .map(usuario -> {
                    // Agora, encontre o perfil específico com base no papel do usuário
                    if (usuario.getPapel() == EPapel.ROLE_RESPONSAVEL) {
                        return responsavelRepository.findByUsuario(usuario)
                            .<ResponseEntity<?>>map(ResponseEntity::ok)
                            .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Perfil de responsável não encontrado."));
                    } else if (usuario.getPapel() == EPapel.ROLE_PROFISSIONAL) {
                        return profissionalRepository.findByUsuario(usuario)
                            .<ResponseEntity<?>>map(ResponseEntity::ok)
                            .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Perfil de profissional não encontrado."));
                    }
                    return ResponseEntity.ok(usuario); // Retorna o usuário base se não for um dos perfis
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário não encontrado."));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Código de verificação inválido.");
        }
    }
}