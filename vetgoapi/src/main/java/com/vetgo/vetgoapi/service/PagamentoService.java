package com.vetgo.vetgoapi.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional; // Importado para Optional

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
    
    // NOVO MÉTODO ADICIONADO: Retorna Optional para ser usado na lógica de agregação.
    public Optional<Pagamento> getByAtendimentoIdOptional(Long atendimentoId) {
        return pagamentoRepository.findByAtendimento_Id(atendimentoId);
    }
    
    // Método para buscar pagamento (lança exceção se não encontrar)
    public Pagamento getByAtendimentoId(Long atendimentoId) {
        return getByAtendimentoIdOptional(atendimentoId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Pagamento não encontrado para o Atendimento com ID: " + atendimentoId
            ));
    }
    
    // Método para pegar status de pagamentos de todos os atendimentos de um responsável
    public List<Pagamento> getPagamentosByResponsavel(Responsavel responsavel) {
            return pagamentoRepository.findByResponsavel(responsavel);
        }
    
    public List<String> getStatusPagamentosByResponsavel(Responsavel responsavel) {
        return getPagamentosByResponsavel(responsavel)
            .stream()
            .map(p -> p.getStatus().name() + "|" + (p.getAtendimento() != null ? p.getAtendimento().getId() : "N/A"))
            .toList();
    }
}