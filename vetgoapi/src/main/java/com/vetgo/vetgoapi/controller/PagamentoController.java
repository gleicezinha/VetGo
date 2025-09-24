package com.vetgo.vetgoapi.controller;

import java.math.BigDecimal;
import java.time.LocalDate;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vetgo.vetgoapi.controller.dto.PagamentoRequestDTO;
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

    public PagamentoController(PagamentoService pagamentoService, AtendimentoRepository atendimentoRepository, ResponsavelRepository responsavelRepository) {
        this.pagamentoService = pagamentoService;
        this.atendimentoRepository = atendimentoRepository;
        this.responsavelRepository = responsavelRepository;
    }

    @PostMapping
    public ResponseEntity<Pagamento> createPagamento(@RequestBody PagamentoRequestDTO dto) {
        Pagamento pagamento = new Pagamento();
        pagamento.setDescricao(dto.getDescricao());
        pagamento.setValorTotal(dto.getValorTotal());
        pagamento.setValorPago(dto.getValorPago());
        pagamento.setStatus(dto.getStatus());
        pagamento.setDataPagamento(LocalDate.now());

        atendimentoRepository.findById(dto.getAtendimentoId())
            .ifPresent(pagamento::setAtendimento);
        
        responsavelRepository.findById(dto.getResponsavelId())
            .ifPresent(pagamento::setResponsavel);

        Pagamento novoPagamento = pagamentoService.save(pagamento);
        return new ResponseEntity<>(novoPagamento, HttpStatus.CREATED);
    }
    
    @GetMapping("/atendimento/{id}")
    public ResponseEntity<Pagamento> getByAtendimentoId(@PathVariable Long id) {
        return ResponseEntity.ok(pagamentoService.getByAtendimentoId(id));
    }
    
}