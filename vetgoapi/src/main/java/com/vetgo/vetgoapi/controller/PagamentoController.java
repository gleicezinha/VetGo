package com.vetgo.vetgoapi.controller;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.vetgo.vetgoapi.controller.dto.PagamentoRequestDTO;
import com.vetgo.vetgoapi.controller.dto.PagamentoResponseDTO;
import com.vetgo.vetgoapi.model.Pagamento;
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
}
