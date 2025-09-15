// src/main/java/com/vetgo/vetgoapi/controller/AtendimentoController.java

package com.vetgo.vetgoapi.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.vetgo.vetgoapi.controller.dto.AgendamentoRequestDTO;
import com.vetgo.vetgoapi.controller.dto.AtendimentoResponseDTO;
import com.vetgo.vetgoapi.model.Atendimento;
import com.vetgo.vetgoapi.repository.AtendimentoRepository;
import com.vetgo.vetgoapi.service.AtendimentoService;

@RestController
@RequestMapping("/api/atendimentos")
public class AtendimentoController {

    private final AtendimentoService atendimentoService;
    private final AtendimentoRepository atendimentoRepository;

    public AtendimentoController(AtendimentoService atendimentoService, AtendimentoRepository atendimentoRepository) {
        this.atendimentoService = atendimentoService;
        this.atendimentoRepository = atendimentoRepository;
    }

    // NOVO ENDPOINT PARA CONSULTAR HORÁRIOS
    @GetMapping("/horarios-ocupados")
    public ResponseEntity<List<String>> getHorariosOcupados(
            @RequestParam Long profissionalId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data) {
        return ResponseEntity.ok(atendimentoService.getHorariosOcupados(profissionalId, data));
    }

    // APROVAÇÃO: Endpoint que retorna a lista de atendimentos completos
    @GetMapping("/por-paciente/{pacienteId}")
    public ResponseEntity<List<Atendimento>> listarPorPaciente(@PathVariable Long pacienteId) {
        List<Atendimento> atendimentos = atendimentoRepository.findByPacienteIdWithDetails(pacienteId);
        return ResponseEntity.ok(atendimentos);
    }

    @PostMapping("/agendar")
    public ResponseEntity<Atendimento> agendar(@RequestBody AgendamentoRequestDTO dto) {
        Atendimento novoAgendamento = atendimentoService.agendarConsulta(dto);
        return new ResponseEntity<>(novoAgendamento, HttpStatus.CREATED);
    }

    @PutMapping("/{id}/cancelar")
    public ResponseEntity<Atendimento> cancelar(@PathVariable Long id) {
        Atendimento atendimentoCancelado = atendimentoService.cancelarConsulta(id);
        return ResponseEntity.ok(atendimentoCancelado);
    }

    @GetMapping("/todos")
    public ResponseEntity<List<AtendimentoResponseDTO>> listarTodos() {
        return ResponseEntity.ok(atendimentoService.getAllAtendimentos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Atendimento> getAtendimentoById(@PathVariable Long id) {
        return ResponseEntity.ok(atendimentoService.getAtendimentoCompleto(id));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAtendimento(@PathVariable Long id) {
        atendimentoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}