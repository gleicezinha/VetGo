package com.vetgo.vetgoapi.service;

import java.math.BigDecimal;
import java.time.LocalDate;

import org.springframework.stereotype.Service;

import com.vetgo.vetgoapi.model.Atendimento;
import com.vetgo.vetgoapi.model.EStatusPagamento;
import com.vetgo.vetgoapi.model.Pagamento;
import com.vetgo.vetgoapi.repository.PagamentoRepository;
import com.vetgo.vetgoapi.service.exception.ResourceNotFoundException;

@Service
public class PagamentoService {
    
    private final PagamentoRepository pagamentoRepository;

    public PagamentoService(PagamentoRepository pagamentoRepository) {
        this.pagamentoRepository = pagamentoRepository;
    }

    public Pagamento save(Pagamento pagamento) {
        // Lógica de validação pode ser adicionada aqui, se necessário
        if (pagamento.getValorTotal().compareTo(BigDecimal.ZERO) < 0 || pagamento.getValorPago().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Valores de pagamento não podem ser negativos.");
        }
        
        return pagamentoRepository.save(pagamento);
    }

    public Pagamento getByAtendimentoId(Long atendimentoId) {
        return pagamentoRepository.findByAtendimentoId(atendimentoId)
            .orElseThrow(() -> new ResourceNotFoundException("Pagamento não encontrado para o Atendimento com ID: " + atendimentoId));
    }
}