package com.vetgo.vetgoapi.controller;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.vetgo.vetgoapi.controller.dto.PagamentoRequestDTO;
import com.vetgo.vetgoapi.controller.dto.PagamentoResponseDTO;
import com.vetgo.vetgoapi.model.Pagamento;
import com.vetgo.vetgoapi.model.Responsavel;
import com.vetgo.vetgoapi.repository.AtendimentoRepository;
import com.vetgo.vetgoapi.repository.ResponsavelRepository;
import com.vetgo.vetgoapi.service.PagamentoService;
import com.vetgo.vetgoapi.service.exception.ResourceNotFoundException;

@RestController
@RequestMapping("/api/pagamentos")
@CrossOrigin(origins = "http://localhost:4200")
public class PagamentoController {

    private final PagamentoService pagamentoService;
    private final AtendimentoRepository atendimentoRepository;
    private final ResponsavelRepository responsavelRepository;

    public PagamentoController(
            PagamentoService pagamentoService,
            AtendimentoRepository atendimentoRepository,
            ResponsavelRepository responsavelRepository) {
        this.pagamentoService = pagamentoService;
        this.atendimentoRepository = atendimentoRepository;
        this.responsavelRepository = responsavelRepository;
    }

    // Endpoint para criar um novo pagamento
    @PostMapping
    public ResponseEntity<PagamentoResponseDTO> createPagamento(@RequestBody PagamentoRequestDTO dto) {
        Pagamento pagamento = new Pagamento();
        pagamento.setDescricao(dto.getDescricao());
        pagamento.setValorTotal(dto.getValorTotal());
        pagamento.setValorPago(dto.getValorPago());
        pagamento.setStatus(dto.getStatus());
        pagamento.setDataPagamento(LocalDate.now());

        atendimentoRepository.findById(dto.getAtendimentoId()).ifPresent(pagamento::setAtendimento);
        responsavelRepository.findById(dto.getResponsavelId()).ifPresent(pagamento::setResponsavel);

        Pagamento novoPagamento = pagamentoService.save(pagamento);

        PagamentoResponseDTO response = new PagamentoResponseDTO(novoPagamento);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Endpoint para atualizar um pagamento existente
    @PutMapping("/{id}")
    public ResponseEntity<PagamentoResponseDTO> updatePagamento(@PathVariable Long id, @RequestBody PagamentoRequestDTO dto) {
        Pagamento pagamentoExistente = pagamentoService.getByAtendimentoId(dto.getAtendimentoId()); // Ou buscar por ID do pagamento
        
        pagamentoExistente.setDescricao(dto.getDescricao());
        pagamentoExistente.setValorTotal(dto.getValorTotal());
        pagamentoExistente.setValorPago(dto.getValorPago());
        pagamentoExistente.setStatus(dto.getStatus());
        
        Pagamento pagamentoAtualizado = pagamentoService.save(pagamentoExistente);
        
        PagamentoResponseDTO response = new PagamentoResponseDTO(pagamentoAtualizado);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/atendimento/{atendimentoId}")
    public ResponseEntity<?> getByAtendimentoId(@PathVariable Long atendimentoId) {
        try {
            Pagamento pagamento = pagamentoService.getByAtendimentoId(atendimentoId);
            return ResponseEntity.ok(new PagamentoResponseDTO(pagamento));
        } catch (ResourceNotFoundException ex) {
            Map<String, String> erro = new HashMap<>();
            erro.put("erro", ex.getMessage());
            return ResponseEntity.status(404).body(erro);
        }
    }

    @GetMapping("/responsavel/{responsavelId}")
    public ResponseEntity<List<PagamentoResponseDTO>> getByResponsavelId(@PathVariable Long responsavelId) {
        Responsavel responsavel = responsavelRepository.findById(responsavelId)
                .orElseThrow(() -> new ResourceNotFoundException("Responsável não encontrado com ID: " + responsavelId));
        List<Pagamento> pagamentos = pagamentoService.getPagamentosByResponsavel(responsavel);
        List<PagamentoResponseDTO> response = pagamentos.stream()
                .map(PagamentoResponseDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }
}