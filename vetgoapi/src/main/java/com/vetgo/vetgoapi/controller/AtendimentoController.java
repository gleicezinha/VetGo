package com.vetgo.vetgoapi.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.vetgo.vetgoapi.model.Atendimento;
import com.vetgo.vetgoapi.service.AtendimentoService;

@RestController
@RequestMapping("/api/atendimentos")
public class AtendimentoController {

    private final AtendimentoService atendimentoService;

    public AtendimentoController(AtendimentoService atendimentoService) {
        this.atendimentoService = atendimentoService;
    }

    // DTO de exemplo
    // public record AgendamentoDto(Long pacienteId, Long profissionalId, LocalDateTime dataHoraAtendimento) {}

    @PostMapping("/agendar")
    public ResponseEntity<Atendimento> agendar(@RequestBody Atendimento atendimento, 
                                               @RequestParam Long pacienteId, 
                                               @RequestParam Long profissionalId) {
        Atendimento novoAgendamento = atendimentoService.agendarConsulta(atendimento, pacienteId, profissionalId);
        return new ResponseEntity<>(novoAgendamento, HttpStatus.CREATED);
    }

    @PutMapping("/{id}/cancelar")
    public ResponseEntity<Atendimento> cancelar(@PathVariable Long id) {
        Atendimento atendimentoCancelado = atendimentoService.cancelarConsulta(id);
        return ResponseEntity.ok(atendimentoCancelado);
    }
}