package com.vetgo.vetgoapi.controller.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.vetgo.vetgoapi.model.Atendimento;

public class AtendimentoResponseDTO {

    private Long id;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime dataHoraAtendimento;
    private String status;
    private String tipoDeAtendimento;
    private String nomePaciente;
    private String nomeResponsavel;
    private String nomeProfissional;

    public AtendimentoResponseDTO(Atendimento atendimento) {
        this.id = atendimento.getId();
        this.dataHoraAtendimento = atendimento.getDataHoraAtendimento();
        this.status = atendimento.getStatus().toString();
        this.tipoDeAtendimento = atendimento.getTipoDeAtendimento().toString();
        this.nomePaciente = atendimento.getPaciente().getNome();
        this.nomeResponsavel = atendimento.getPaciente().getResponsavel().getUsuario().getNomeUsuario();
        this.nomeProfissional = atendimento.getProfissional().getUsuario().getNomeUsuario();
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getDataHoraAtendimento() {
        return dataHoraAtendimento;
    }

    public void setDataHoraAtendimento(LocalDateTime dataHoraAtendimento) {
        this.dataHoraAtendimento = dataHoraAtendimento;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTipoDeAtendimento() {
        return tipoDeAtendimento;
    }

    public void setTipoDeAtendimento(String tipoDeAtendimento) {
        this.tipoDeAtendimento = tipoDeAtendimento;
    }

    public String getNomePaciente() {
        return nomePaciente;
    }

    public void setNomePaciente(String nomePaciente) {
        this.nomePaciente = nomePaciente;
    }

    public String getNomeResponsavel() {
        return nomeResponsavel;
    }

    public void setNomeResponsavel(String nomeResponsavel) {
        this.nomeResponsavel = nomeResponsavel;
    }

    public String getNomeProfissional() {
        return nomeProfissional;
    }

    public void setNomeProfissional(String nomeProfissional) {
        this.nomeProfissional = nomeProfissional;
    }
}