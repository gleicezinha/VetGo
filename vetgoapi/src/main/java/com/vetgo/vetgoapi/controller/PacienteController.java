package com.vetgo.vetgoapi.controller;

import com.vetgo.vetgoapi.model.Paciente;
import com.vetgo.vetgoapi.service.PacienteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pacientes")
public class PacienteController {

    private final PacienteService pacienteService;

    public PacienteController(PacienteService pacienteService) {
        this.pacienteService = pacienteService;
    }
    
    // DTO de exemplo:
    // public record PacienteCadastroDto(String nome, EEspecie especie, String raca, ESexo sexo, LocalDate dataNascimento, ESituacao situacao, Long idResponsavel) {}

    @PostMapping
    public ResponseEntity<Paciente> registrarPaciente(@RequestBody Paciente paciente, @RequestParam Long idResponsavel) {
        // O ideal é receber um DTO que contenha o ID do responsável
        Paciente novoPaciente = pacienteService.registrarNovoPaciente(paciente, idResponsavel);
        return new ResponseEntity<>(novoPaciente, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Paciente> buscarPacientePorId(@PathVariable Long id) {
        Paciente paciente = pacienteService.buscarPorId(id);
        return ResponseEntity.ok(paciente);
    }

    // Endpoint para buscar todos os pets de um tutor específico. Muito útil!
    @GetMapping("/por-tutor/{idResponsavel}")
    public ResponseEntity<List<Paciente>> listarPacientesPorTutor(@PathVariable Long idResponsavel) {
        List<Paciente> pacientes = pacienteService.listarPacientesPorTutor(idResponsavel);
        return ResponseEntity.ok(pacientes);
    }
}