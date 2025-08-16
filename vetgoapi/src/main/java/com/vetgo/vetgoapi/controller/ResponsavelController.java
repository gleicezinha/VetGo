package com.vetgo.vetgoapi.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity; // Usaremos o repo para listagens simples
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vetgo.vetgoapi.model.Responsavel;
import com.vetgo.vetgoapi.model.Usuario;
import com.vetgo.vetgoapi.repository.ResponsavelRepository;
import com.vetgo.vetgoapi.service.CadastroService;
import com.vetgo.vetgoapi.service.exception.ResourceNotFoundException;

@RestController
@RequestMapping("/api/responsaveis") // Define o prefixo da URL para este controller
public class ResponsavelController {

    private final CadastroService cadastroService;
    private final ResponsavelRepository responsavelRepository;

    public ResponsavelController(CadastroService cadastroService, ResponsavelRepository responsavelRepository) {
        this.cadastroService = cadastroService;
        this.responsavelRepository = responsavelRepository;
    }

    // DTO de exemplo para cadastro (deve ser criado em um pacote 'dto')
    // public record TutorCadastroDto(String nomeUsuario, String email, String senha, String cpf, String telefone, Endereco endereco) {}

    @PostMapping
    public ResponseEntity<Responsavel> cadastrarTutor(@RequestBody Usuario usuario) {
        // Idealmente, aqui receberíamos um DTO e o converteríamos para a entidade Usuario
        Responsavel novoResponsavel = cadastroService.cadastrarTutor(usuario);
        return new ResponseEntity<>(novoResponsavel, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Responsavel>> listarTodosResponsaveis() {
        List<Responsavel> responsaveis = responsavelRepository.findAll();
        return ResponseEntity.ok(responsaveis);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Responsavel> buscarPorId(@PathVariable Long id) {
        Responsavel responsavel = responsavelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Responsável não encontrado com o ID: " + id));
        return ResponseEntity.ok(responsavel);
    }
    
    // Outros endpoints como PUT (para atualizar) e DELETE podem ser adicionados aqui.
}