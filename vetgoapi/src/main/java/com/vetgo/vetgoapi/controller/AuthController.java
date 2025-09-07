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

import com.vetgo.vetgoapi.service.UsuarioService;
import com.vetgo.vetgoapi.service.exception.ResourceNotFoundException;



import com.vetgo.vetgoapi.service.WhapiService; // Importe o novo serviço


@RestController
@RequestMapping("/auth")
public class AuthController {
    private final WhapiService whapiService; // Injete a nova classe
    private final UsuarioService usuarioService;
     private final ResponsavelRepository responsavelRepository;
     private final ProfissionalRepository profissionalRepository;

public AuthController(WhapiService whapiService, UsuarioService usuarioService, ResponsavelRepository responsavelRepository, ProfissionalRepository profissionalRepository) {
	this.whapiService = whapiService;
	this.usuarioService = usuarioService;
	this.responsavelRepository = responsavelRepository;
	this.profissionalRepository = profissionalRepository;
}

@PostMapping("/send-code")
public ResponseEntity<String> sendCode(@RequestBody PhoneRequest request) {
    try {
        usuarioService.getByTelefone(request.getPhone())
            .orElseThrow(() -> new ResourceNotFoundException("Telefone não cadastrado."));

        String status = whapiService.sendCode(request.getPhone());
        return ResponseEntity.ok(status);
    } catch (ResourceNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro interno ao enviar o código.");
    }
}

@PostMapping("/verify-code")
public ResponseEntity<?> verifyCode(@RequestBody VerifyRequest request) {
	String whapiStatus = whapiService.verifyCode(request.getPhone(), request.getCode());
	
	if ("approved".equals(whapiStatus)) {
		// Se o código for aprovado, busque o usuário e o perfil
		return usuarioService.getByTelefone(request.getPhone())
			.map(usuario -> {
				// Encontre o perfil com base no papel do usuário
				if (usuario.getPapel() == EPapel.ROLE_RESPONSAVEL) {
					return responsavelRepository.findByUsuario(usuario)
						.<ResponseEntity<?>>map(ResponseEntity::ok)
						.orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Perfil de responsável não encontrado."));
				} else if (usuario.getPapel() == EPapel.ROLE_PROFISSIONAL) {
					return profissionalRepository.findByUsuario(usuario)
						.<ResponseEntity<?>>map(ResponseEntity::ok)
						.orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Perfil de profissional não encontrado."));
				}
				// Caso o papel não seja reconhecido, retorna apenas o usuário
				return ResponseEntity.ok(usuario);
			})
			.orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário não encontrado."));
	} else {
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Código de verificação inválido.");
	}
}
}