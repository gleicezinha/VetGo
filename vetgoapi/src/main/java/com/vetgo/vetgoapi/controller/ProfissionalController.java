package com.vetgo.vetgoapi.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vetgo.vetgoapi.model.Profissional;
import com.vetgo.vetgoapi.repository.ProfissionalRepository;

@RestController
@RequestMapping("/api/profissionais")
@CrossOrigin(origins = "http://localhost:4200") // Garante que o frontend pode acessar
public class ProfissionalController {

    private final ProfissionalRepository profissionalRepository;

    public ProfissionalController(ProfissionalRepository profissionalRepository) {
        this.profissionalRepository = profissionalRepository;
    }

    // O frontend vai chamar este endpoint
    @GetMapping("/consultar-todos")
    public ResponseEntity<List<Profissional>> listarTodos() {
        return ResponseEntity.ok(profissionalRepository.findAll());
    }
}