package com.vetgo.vetgoapi.model;
import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint; 


@Entity
@Table(uniqueConstraints = {
    @UniqueConstraint(columnNames =  { "dataDeAtendimento", "horarioDeAtendimento", "profissional_id"}),
    @UniqueConstraint(columnNames =  { "dataDeAtendimento", "horarioDeAtendimento", "paciente_id"})
})
public class Atendimento implements Serializable {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;

    @Column(nullable = false)
    private LocalDate dataDeAtendimento;

    @Column(nullable = false)
    private LocalTime horarioDeAtendimento;

    @ManyToOne
    private Profissional profissional;

    @ManyToOne
    private Paciente paciente;

    @Column(nullable = false, unique = true)
    private String cpf;

    @Enumerated(EnumType.STRING)
    private EStatus status = EStatus.AGENDADO;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private EAtendimento tipoDeAtendimento;

    private Long idPai;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDataDeAtendimento() {
        return dataDeAtendimento;
    }

    public void setDataDeAtendimento(LocalDate dataDeAtendimento) {
        this.dataDeAtendimento = dataDeAtendimento;
    }

    public LocalTime getHorarioDeAtendimento() {
        return horarioDeAtendimento;
    }

    public void setHorarioDeAtendimento(LocalTime horarioDeAtendimento) {
        this.horarioDeAtendimento = horarioDeAtendimento;
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

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
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

