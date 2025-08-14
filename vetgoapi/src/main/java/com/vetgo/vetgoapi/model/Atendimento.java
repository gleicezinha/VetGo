package com.vetgo.vetgoapi.model;

import java.io.Serializable;
import java.time.LocalDateTime; // IMPORT ATUALIZADO

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "atendimento", uniqueConstraints = {
    // CONSTRAINTS ATUALIZADAS PARA USAR O NOVO CAMPO
    @UniqueConstraint(columnNames = { "data_hora_atendimento", "profissional_id"}),
    @UniqueConstraint(columnNames = { "data_hora_atendimento", "paciente_id"})
})
public class Atendimento implements Serializable {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // NOVO CAMPO UNIFICADO
    @Column(name = "data_hora_atendimento", nullable = false)
    private LocalDateTime dataHoraAtendimento;

    @ManyToOne
    @JoinColumn(name = "profissional_id")
    private Profissional profissional;

    @ManyToOne
    @JoinColumn(name = "paciente_id")
    private Paciente paciente;

    @Enumerated(EnumType.STRING)
    private EStatus status = EStatus.AGENDADO;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private EAtendimento tipoDeAtendimento;

    private Long idPai;

    // --- Getters e Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    // GETTER E SETTER ATUALIZADO
    public LocalDateTime getDataHoraAtendimento() {
        return dataHoraAtendimento;
    }

    public void setDataHoraAtendimento(LocalDateTime dataHoraAtendimento) {
        this.dataHoraAtendimento = dataHoraAtendimento;
    }

    public Profissional getProfissional() {
        return profissional;
    }

    public void setProfissional(Profissional profissional) {
        this.profissional = profissional;
    }

    public Paciente getPaciente() {
        return paciente;
    }

    public void setPaciente(Paciente paciente) {
        this.paciente = paciente;
    }

    public EStatus getStatus() {
        return status;
    }

    public void setStatus(EStatus status) {
        this.status = status;
    }

    public EAtendimento getTipoDeAtendimento() {
        return tipoDeAtendimento;
    }

    public void setTipoDeAtendimento(EAtendimento tipoDeAtendimento) {
        this.tipoDeAtendimento = tipoDeAtendimento;
    }

    public Long getIdPai() {
        return idPai;
    }

    public void setIdPai(Long idPai) {
        this.idPai = idPai;
    }
}