package com.vetgo.vetgoapi.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
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

    @GetMapping("/horarios-ocupados")
    public ResponseEntity<List<String>> getHorariosOcupados(
            @RequestParam Long profissionalId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data) {
        return ResponseEntity.ok(atendimentoService.getHorariosOcupados(profissionalId, data));
    }

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

  // Endpoint que retorna a lista de atendimentos completos - [MODIFICADO] Adiciona paginação e busca
    @GetMapping("/todos")
    public ResponseEntity<Page<AtendimentoResponseDTO>> listarTodos(
            @RequestParam(required = false) String termoBusca,
            @PageableDefault(size = 10, sort = "dataHoraAtendimento") Pageable pageable) {
        
        Page<AtendimentoResponseDTO> atendimentosPage = atendimentoService.searchAllWithDetails(termoBusca, pageable);
        
        return ResponseEntity.ok(atendimentosPage);
    }

    // MÉTODO MODIFICADO
    @GetMapping("/{id}")
    public ResponseEntity<AtendimentoResponseDTO> getAtendimentoById(@PathVariable Long id) {
        Atendimento atendimento = atendimentoService.getAtendimentoCompleto(id);
        return ResponseEntity.ok(new AtendimentoResponseDTO(atendimento));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAtendimento(@PathVariable Long id) {
        atendimentoService.delete(id);
        return ResponseEntity.noContent().build();
    }
    
    // MÉTODO NOVO PARA SALVAR A EDIÇÃO
    @PutMapping("/{id}")
    public ResponseEntity<Atendimento> updateAtendimento(@PathVariable Long id, @RequestBody Atendimento atendimento) {
        atendimento.setId(id);
        Atendimento atendimentoAtualizado = atendimentoService.save(atendimento);
        return ResponseEntity.ok(atendimentoAtualizado);
    }
}