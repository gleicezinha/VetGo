package com.vetgo.vetgoapi.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;

import com.vetgo.vetgoapi.model.Pagamento;
import com.vetgo.vetgoapi.model.Responsavel;
import com.vetgo.vetgoapi.repository.PagamentoRepository;
import com.vetgo.vetgoapi.service.exception.ResourceNotFoundException;

@Service
public class PagamentoService {
    
    private final PagamentoRepository pagamentoRepository;

    public PagamentoService(PagamentoRepository pagamentoRepository) {
        this.pagamentoRepository = pagamentoRepository;
    }

    // Método para salvar ou atualizar um pagamento
    public Pagamento save(Pagamento pagamento) {
        // Lógica de validação pode ser adicionada aqui, se necessário
        if (pagamento.getValorTotal().compareTo(BigDecimal.ZERO) < 0 || pagamento.getValorPago().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Valores de pagamento não podem ser negativos.");
        }
        
        return pagamentoRepository.save(pagamento);
    }

    public Pagamento getByAtendimentoId(Long atendimentoId) {
        return pagamentoRepository.findByAtendimento_Id(atendimentoId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Pagamento não encontrado para o Atendimento com ID: " + atendimentoId
            ));
    }
    // Método para pegar status de pagamentos de todos os atendimentos de um responsável
    public List<Pagamento> getPagamentosByResponsavel(Responsavel responsavel) {
            return pagamentoRepository.findByResponsavel(responsavel);
        }
    
    public List<String> getStatusPagamentosByResponsavel(Responsavel responsavel) {
        return pagamentoRepository.findByResponsavel(responsavel)
            .stream()
            .map(p -> p.getStatus().name()) // ou p.getStatus() se for enum mesmo
            .toList();
    }
}