package com.vetgo.vetgoapi.model;

import java.io.Serializable;
import java.time.LocalDate;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "historico_clinico") // Mapeia para a tabela 'historico_clinico' do DER
public class HistoricoClinico implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_historico") // Mapeia para a chave primária 'id_historico'
    private Long id;

    // Relacionamento Muitos-para-Um: Muitos históricos para um Paciente
    @ManyToOne(fetch = FetchType.LAZY) // LAZY é ideal para performance
    @JoinColumn(name = "id_pet", nullable = false) // Define a chave estrangeira 'id_pet'
    private Paciente paciente;

    @Column(name = "data", nullable = false)
    private LocalDate data;

    @Column(name = "descricao", columnDefinition = "TEXT", nullable = false) // 'TEXT' para campos longos
    private String descricao;

    @Column(name = "observacoes", columnDefinition = "TEXT") // 'TEXT' para campos longos
    private String observacoes;

    // Getters e Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Paciente getPaciente() {
        return paciente;
    }

    public void setPaciente(Paciente paciente) {
        this.paciente = paciente;
    }

    public LocalDate getData() {
        return data;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }
}