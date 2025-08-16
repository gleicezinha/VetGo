package com.vetgo.vetgoapi.controller;

import com.vetgo.vetgoapi.model.Paciente;
import com.vetgo.vetgoapi.service.PacienteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pacientes")
@CrossOrigin(origins = "http://localhost:4200") // Certifique-se de que a anotação está presente
public class PacienteController implements ICrudController<Paciente>  {

    
    private final PacienteService servico;

    public PacienteController(PacienteService servico){
        this.servico = servico;
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
    
    // Novo endpoint para listar pacientes por ID de tutor
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

    @Override
    @PostMapping("/inserir")
    public ResponseEntity<Paciente> insert(@RequestBody Paciente objeto) {
        Paciente registro = servico.save(objeto);
        return ResponseEntity.ok(registro);
    }

    @Override
    @PutMapping("/atualizar")
    public ResponseEntity<Paciente> update(@RequestBody Paciente objeto) {
        Paciente registro = servico.save(objeto);
        return ResponseEntity.ok(registro);
    }
}