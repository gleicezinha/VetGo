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
@CrossOrigin(origins = "http://localhost:4200") // ⬅️ ANOTAÇÃO DE CORS ADICIONADA/CORRIGIDA
public class PacienteController {

    private final PacienteService servico;
    private final ResponsavelRepository responsavelRepository;

    public PacienteController(PacienteService servico, ResponsavelRepository responsavelRepository) {
        this.servico = servico;
        this.responsavelRepository = responsavelRepository;
    }

    @DeleteMapping("/{id}") // ⬅️ CORREÇÃO: URL alinhada com o front-end
    public ResponseEntity<?> delete(@PathVariable Long id) {
        servico.delete(id);
        return ResponseEntity.ok().build();
    }

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
    @PutMapping("/{id}")
        public ResponseEntity<Paciente> update(@PathVariable Long id, @RequestBody Paciente objeto) {
            // 1. Busca o paciente existente no banco de dados.
            Paciente pacienteExistente = servico.get(id); // Usa o método get do service, que lança exceção se não encontrar
            
            // 2. Atualiza apenas os campos do paciente com os dados da requisição.
            pacienteExistente.setNome(objeto.getNome());
            pacienteExistente.setEspecie(objeto.getEspecie());
            pacienteExistente.setRaca(objeto.getRaca());
            pacienteExistente.setPeso(objeto.getPeso());
            pacienteExistente.setSexo(objeto.getSexo());
            pacienteExistente.setDataNascimento(objeto.getDataNascimento());
            pacienteExistente.setSituacao(objeto.getSituacao());

            // 3. Se um novo responsável for enviado com um ID válido, atualiza a referência. Caso contrário, mantém a existente.
            if (objeto.getResponsavel() != null && objeto.getResponsavel().getId() != null) {
                Responsavel novoResponsavel = responsavelRepository.findById(objeto.getResponsavel().getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Responsável não encontrado com o ID: " + objeto.getResponsavel().getId()));
                pacienteExistente.setResponsavel(novoResponsavel);
            }

            // 4. Salva o paciente atualizado no banco de dados.
            Paciente registro = servico.save(pacienteExistente);
            return ResponseEntity.ok(registro);
        }
    }