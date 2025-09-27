package com.vetgo.vetgoapi.controller;

import java.util.List;

import org.springframework.data.domain.Page; // [MOD]
import org.springframework.data.domain.Pageable; // [MOD]
import org.springframework.data.web.PageableDefault; // [MOD]
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

import com.vetgo.vetgoapi.controller.dto.ResponsavelDTO;
import com.vetgo.vetgoapi.model.Responsavel;
import com.vetgo.vetgoapi.repository.ResponsavelRepository;
import com.vetgo.vetgoapi.repository.UsuarioRepository;
// ... (outros imports)
import com.vetgo.vetgoapi.service.CadastroService;
import com.vetgo.vetgoapi.service.PagamentoService;
import com.vetgo.vetgoapi.service.ResponsavelService;
import com.vetgo.vetgoapi.service.exception.ResourceNotFoundException;

@RestController
@RequestMapping("/api/responsaveis")
@CrossOrigin(origins = "http://localhost:4200") // Garante que o frontend pode acessar
public class ResponsavelController {

    private final CadastroService cadastroService;
    private final ResponsavelRepository responsavelRepository;
    private final UsuarioRepository usuarioRepository;
    private final ResponsavelService responsavelService;
    private final PagamentoService pagamentoService;

        public ResponsavelController(CadastroService cadastroService,
                                    ResponsavelRepository responsavelRepository,
                                    UsuarioRepository usuarioRepository,
                                    ResponsavelService responsavelService,
                                    PagamentoService pagamentoService) {
            this.cadastroService = cadastroService;
            this.responsavelRepository = responsavelRepository;
            this.usuarioRepository = usuarioRepository;
            this.responsavelService = responsavelService;
            this.pagamentoService = pagamentoService;
        }

    @PostMapping
    public ResponseEntity<Responsavel> cadastrarTutor(@RequestBody Responsavel responsavel) {
        Responsavel novoResponsavel = cadastroService.cadastrarTutor(responsavel.getUsuario());
        return new ResponseEntity<>(novoResponsavel, HttpStatus.CREATED);
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
    
    // NOVO ENDPOINT ADICIONADO PARA BUSCAR RESPONSAVEL POR ID DO USUARIO
    @GetMapping("/por-usuario/{usuarioId}")
    public ResponseEntity<Responsavel> buscarPorUsuarioId(@PathVariable Long usuarioId) {
        return responsavelService.getByUsuarioId(usuarioId)
            .map(ResponseEntity::ok)
            .orElseThrow(() -> new ResourceNotFoundException("Responsável não encontrado para o Usuário com ID: " + usuarioId));
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
    
    // [MOD] Endpoint para listar clientes com paginação
    @GetMapping("/clientes")
    public ResponseEntity<Page<ResponsavelDTO>> listarClientes(@PageableDefault(size = 10) Pageable pageable) { // [MOD]
        
        Page<Responsavel> responsaveisPage = responsavelService.getAllResponsaveis(pageable); // [MOD]

        Page<ResponsavelDTO> dtosPage = responsaveisPage.map(r -> { // [MOD] Usa .map() do Page
            ResponsavelDTO dto = new ResponsavelDTO();
            dto.setId(r.getId());
            dto.setNomeUsuario(r.getUsuario().getNomeUsuario());
            dto.setEmail(r.getUsuario().getEmail());
            dto.setTelefone(r.getUsuario().getTelefone());
            dto.setEndereco(r.getUsuario().getEndereco());
            // Chama o método que já existia no service, passando a entidade
            dto.setStatusPagamentos(pagamentoService.getStatusPagamentosByResponsavel(r));
            return dto;
        });

        return ResponseEntity.ok(dtosPage); // [MOD]
    }
  
}