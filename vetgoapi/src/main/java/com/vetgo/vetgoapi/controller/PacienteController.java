package com.vetgo.vetgoapi.controller;

import com.vetgo.vetgoapi.model.Paciente;
import com.vetgo.vetgoapi.model.Responsavel;
import com.vetgo.vetgoapi.repository.ResponsavelRepository;
import com.vetgo.vetgoapi.service.PacienteService;
import com.vetgo.vetgoapi.service.exception.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pacientes")
@CrossOrigin(origins = "http://localhost:4200") // Certifique-se de que a anotação está presente
public class PacienteController implements ICrudController<Paciente>  {

    
    private final PacienteService servico;
    private final ResponsavelRepository responsavelRepository;

    public PacienteController(PacienteService servico, ResponsavelRepository responsavelRepository){
        this.servico = servico;
        this.responsavelRepository = responsavelRepository;
    }

    @Override
    @DeleteMapping("/remover/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        servico.delete(id);
        return ResponseEntity.ok().build();
    }

    @Override
    @GetMapping("/consultar-todos")
    public ResponseEntity<List<Paciente>> get(@RequestParam(required = false) String termoBusca) {
        List<Paciente> registros = servico.get(termoBusca);
        return ResponseEntity.ok(registros);
    }
    
    @GetMapping("/por-tutor/{idResponsavel}")
    public ResponseEntity<List<Paciente>> listarPacientesPorTutor(@PathVariable Long idResponsavel) {
        List<Paciente> pacientes = servico.listarPacientesPorTutor(idResponsavel);
        return ResponseEntity.ok(pacientes);
    }

    @Override
    @GetMapping("/{id}")
    public ResponseEntity<Paciente> get(@PathVariable Long id) {
        Paciente registro = servico.get(id);
        return ResponseEntity.ok(registro);
    }

    @PostMapping
    public ResponseEntity<Paciente> insert(@RequestBody Paciente objeto, @RequestParam Long idResponsavel) {
        Responsavel responsavel = responsavelRepository.findById(idResponsavel)
            .orElseThrow(() -> new ResourceNotFoundException("Responsável não encontrado com o ID: " + idResponsavel));
        
        objeto.setResponsavel(responsavel);
        Paciente registro = servico.save(objeto);
        return ResponseEntity.status(HttpStatus.CREATED).body(registro);
    }

    @Override
    @PutMapping("/atualizar")
    public ResponseEntity<Paciente> update(@RequestBody Paciente objeto) {
        Paciente registro = servico.save(objeto);
        return ResponseEntity.ok(registro);
    }
}