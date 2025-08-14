package com.vetgo.vetgoapi.model;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "pagamento")
public class Pagamento implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pagamento")
    private Long id;

    // Muitos pagamentos podem ser de um Tutor (Responsavel)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tutor", nullable = false)
    private Responsavel responsavel;

    // Um pagamento pode estar associado a um atendimento específico
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_consulta")
    private Atendimento atendimento;
    
    @Column(columnDefinition = "TEXT")
    private String descricao;

    // Use BigDecimal para valores monetários para evitar problemas de precisão
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valor;

    @Column(name = "data_pagamento")
    private LocalDate dataPagamento;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EStatusPagamento status; // Ex: PENDENTE, PAGO, VENCIDO

    // Getters e Setters
}