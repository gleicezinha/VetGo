package com.vetgo.vetgoapi.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.vetgo.vetgoapi.model.Responsavel;
import com.vetgo.vetgoapi.model.Usuario;
import com.vetgo.vetgoapi.repository.ResponsavelRepository;
import com.vetgo.vetgoapi.repository.UsuarioRepository;
import com.vetgo.vetgoapi.service.CadastroService;
import com.vetgo.vetgoapi.service.exception.BusinessRuleException;
import com.vetgo.vetgoapi.service.exception.ResourceNotFoundException;
import com.vetgo.vetgoapi.service.ResponsavelService;

@RestController
@RequestMapping("/api/responsaveis")
public class ResponsavelController {

    private final CadastroService cadastroService;
    private final ResponsavelRepository responsavelRepository;
    private final UsuarioRepository usuarioRepository;
    private final ResponsavelService responsavelService;

    public ResponsavelController(CadastroService cadastroService, ResponsavelRepository responsavelRepository, UsuarioRepository usuarioRepository, ResponsavelService responsavelService) {
        this.cadastroService = cadastroService;
        this.responsavelRepository = responsavelRepository;
        this.usuarioRepository = usuarioRepository;
        this.responsavelService = responsavelService;
    }

    @PostMapping
    public ResponseEntity<Responsavel> cadastrarTutor(@RequestBody Responsavel responsavel) {
        Responsavel novoResponsavel = cadastroService.cadastrarTutor(responsavel.getUsuario());
        return new ResponseEntity<>(novoResponsavel, HttpStatus.CREATED);
    }
    
    @PostMapping("/login-contato")
    public ResponseEntity<Responsavel> loginComContato(@RequestBody Usuario usuario) {
        Optional<Responsavel> responsavel = responsavelService.getByTelefone(usuario.getTelefone());
        if (responsavel.isPresent()) {
            return ResponseEntity.ok(responsavel.get());
        } else {
            throw new ResourceNotFoundException("Contato não cadastrado.");
        }
    }

    @GetMapping
    public ResponseEntity<List<Responsavel>> listarTodosResponsaveis() {
        List<Responsavel> responsaveis = responsavelRepository.findAll();
        return ResponseEntity.ok(responsaveis);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Responsavel> buscarPorId(@PathVariable Long id) {
        return responsavelRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Responsável não encontrado com o ID: " + id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Responsavel> atualizarTutor(@PathVariable Long id, @RequestBody Responsavel dadosAtualizados) {
        return responsavelRepository.findById(id)
            .map(responsavelExistente -> {
                var usuarioExistente = responsavelExistente.getUsuario();
                var usuarioAtualizado = dadosAtualizados.getUsuario();
                usuarioExistente.setNomeUsuario(usuarioAtualizado.getNomeUsuario());
                usuarioExistente.setEmail(usuarioAtualizado.getEmail());
                usuarioExistente.setTelefone(usuarioAtualizado.getTelefone());
                usuarioExistente.setCpf(usuarioAtualizado.getCpf());

                var enderecoExistente = usuarioExistente.getEndereco();
                var enderecoAtualizado = usuarioAtualizado.getEndereco();
                enderecoExistente.setCep(enderecoAtualizado.getCep());
                enderecoExistente.setBairro(enderecoAtualizado.getBairro());
                enderecoExistente.setEstado(enderecoAtualizado.getEstado());
                enderecoExistente.setComplemento(enderecoAtualizado.getComplemento());
                enderecoExistente.setLogradouro(enderecoAtualizado.getLogradouro());
                enderecoExistente.setNumero(enderecoAtualizado.getNumero());
                enderecoExistente.setCidade(enderecoAtualizado.getCidade());

                Responsavel salvo = responsavelRepository.save(responsavelExistente);
                return ResponseEntity.ok(salvo);
            })
            .orElseThrow(() -> new ResourceNotFoundException("Responsável não encontrado com o ID: " + id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarTutor(@PathVariable Long id) {
        if (!responsavelRepository.existsById(id)) {
            throw new ResourceNotFoundException("Responsável não encontrado com o ID: " + id);
        }
        responsavelRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}