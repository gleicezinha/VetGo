// src/main/java/com/vetgo/vetgoapi/controller/AtendimentoController.java

package com.vetgo.vetgoapi.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

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

    // Endpoint que retorna a lista de atendimentos completos
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

  // Endpoint que retorna a lista de atendimentos completos - [change] ATUALIZADO para incluir busca
    @GetMapping("/todos")
    public ResponseEntity<List<AtendimentoResponseDTO>> listarTodos(@RequestParam(required = false) String termoBusca) {
        return ResponseEntity.ok(atendimentoService.get(termoBusca)); // [change] Usa o novo método get do service
    }

    // Endpoint para buscar atendimento por ID para que retorne o DTO com todos os campos necessários.
    @GetMapping("/{id}")
    public ResponseEntity<AtendimentoResponseDTO> getAtendimentoById(@PathVariable Long id) {
        Atendimento atendimento = atendimentoService.getAtendimentoCompleto(id);
        AtendimentoResponseDTO responseDTO = new AtendimentoResponseDTO(atendimento);
        return ResponseEntity.ok(responseDTO);
    }
    
    // NOVO ENDPOINT: Buscar todos os atendimentos de um responsável
    @GetMapping("/por-responsavel/{responsavelId}")
    public ResponseEntity<List<AtendimentoResponseDTO>> getAtendimentoByResponsavelId(@PathVariable Long responsavelId) {
        List<Atendimento> atendimentos = atendimentoService.getAtendimentosByResponsavelId(responsavelId);
        List<AtendimentoResponseDTO> responseDTOs = atendimentos.stream()
            .map(AtendimentoResponseDTO::new)
            .collect(Collectors.toList());
        return ResponseEntity.ok(responseDTOs);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAtendimento(@PathVariable Long id) {
        atendimentoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}