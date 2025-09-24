package com.vetgo.vetgoapi.controller.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.vetgo.vetgoapi.model.Atendimento;
import com.vetgo.vetgoapi.model.EStatusPagamento;
import com.vetgo.vetgoapi.model.Responsavel;

public class PagamentoRequestDTO {
    
    private String descricao;
    private BigDecimal valorTotal;
    private BigDecimal valorPago;
    private EStatusPagamento status;
    private Long atendimentoId;
    private Long responsavelId;

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public BigDecimal getValorTotal() {
        return valorTotal;
    }

    public void setValorTotal(BigDecimal valorTotal) {
        this.valorTotal = valorTotal;
    }

    public BigDecimal getValorPago() {
        return valorPago;
    }

    public void setValorPago(BigDecimal valorPago) {
        this.valorPago = valorPago;
    }

    public EStatusPagamento getStatus() {
        return status;
    }

    public void setStatus(EStatusPagamento status) {
        this.status = status;
    }

    public Long getAtendimentoId() {
        return atendimentoId;
    }

    public void setAtendimentoId(Long atendimentoId) {
        this.atendimentoId = atendimentoId;
    }

    public Long getResponsavelId() {
        return responsavelId;
    }

    public void setResponsavelId(Long responsavelId) {
        this.responsavelId = responsavelId;
    }
}