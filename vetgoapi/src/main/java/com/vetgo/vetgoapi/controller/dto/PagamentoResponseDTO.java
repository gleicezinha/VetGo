package com.vetgo.vetgoapi.controller.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.vetgo.vetgoapi.model.Pagamento;
import com.vetgo.vetgoapi.model.EStatusPagamento;

public class PagamentoResponseDTO {

    private Long id;
    private String descricao;
    private BigDecimal valorTotal;
    private BigDecimal valorPago;
    private LocalDate dataPagamento;
    private EStatusPagamento status;
    private Long atendimentoId;
    private Long responsavelId;
    private String responsavelNome;

    public PagamentoResponseDTO() {}

    // Construtor seguro que converte entidade para DTO (não assume campos não inicializados)
    public PagamentoResponseDTO(Pagamento pagamento) {
        if (pagamento == null) return;

        this.id = pagamento.getId();
        this.descricao = pagamento.getDescricao();
        this.valorTotal = pagamento.getValorTotal();
        this.valorPago = pagamento.getValorPago();
        this.dataPagamento = pagamento.getDataPagamento();
        this.status = pagamento.getStatus();

        if (pagamento.getAtendimento() != null) {
            this.atendimentoId = pagamento.getAtendimento().getId();
        }

        if (pagamento.getResponsavel() != null) {
            this.responsavelId = pagamento.getResponsavel().getId();

            // ATENÇÃO: use o getter que existe no seu Usuario. Aqui uso getNomeUsuario().
            if (pagamento.getResponsavel().getUsuario() != null) {
                this.responsavelNome = pagamento.getResponsavel().getUsuario().getNomeUsuario();
            }
        }
    }

    // Getters / Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public BigDecimal getValorTotal() { return valorTotal; }
    public void setValorTotal(BigDecimal valorTotal) { this.valorTotal = valorTotal; }

    public BigDecimal getValorPago() { return valorPago; }
    public void setValorPago(BigDecimal valorPago) { this.valorPago = valorPago; }

    public LocalDate getDataPagamento() { return dataPagamento; }
    public void setDataPagamento(LocalDate dataPagamento) { this.dataPagamento = dataPagamento; }

    public EStatusPagamento getStatus() { return status; }
    public void setStatus(EStatusPagamento status) { this.status = status; }

    public Long getAtendimentoId() { return atendimentoId; }
    public void setAtendimentoId(Long atendimentoId) { this.atendimentoId = atendimentoId; }

    public Long getResponsavelId() { return responsavelId; }
    public void setResponsavelId(Long responsavelId) { this.responsavelId = responsavelId; }

    public String getResponsavelNome() { return responsavelNome; }
    public void setResponsavelNome(String responsavelNome) { this.responsavelNome = responsavelNome; }
}
