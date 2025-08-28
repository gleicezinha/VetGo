package com.vetgo.vetgoapi.controller.dto;

import java.time.LocalDateTime;

import com.vetgo.vetgoapi.model.EAtendimento;

// DTO para receber os dados do agendamento
public class AgendamentoRequestDTO {

    private Long pacienteId;
    private Long profissionalId;
    private LocalDateTime dataHoraAtendimento;
    private EAtendimento tipoDeAtendimento;

    // Getters e Setters

    public Long getPacienteId() {
        return pacienteId;
    }

    public void setPacienteId(Long pacienteId) {
        this.pacienteId = pacienteId;
    }

    public Long getProfissionalId() {
        return profissionalId;
    }

    public void setProfissionalId(Long profissionalId) {
        this.profissionalId = profissionalId;
    }

    public LocalDateTime getDataHoraAtendimento() {
        return dataHoraAtendimento;
    }

    public void setDataHoraAtendimento(LocalDateTime dataHoraAtendimento) {
        this.dataHoraAtendimento = dataHoraAtendimento;
    }

    public EAtendimento getTipoDeAtendimento() {
        return tipoDeAtendimento;
    }

    public void setTipoDeAtendimento(EAtendimento tipoDeAtendimento) {
        this.tipoDeAtendimento = tipoDeAtendimento;
    }
}