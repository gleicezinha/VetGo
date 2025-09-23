package com.vetgo.vetgoapi.controller;

import com.vetgo.vetgoapi.model.Procedimento;
import com.vetgo.vetgoapi.service.ProcedimentoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/procedimentos")
@CrossOrigin(origins = "http://localhost:4200")
public class ProcedimentoController {

    private final ProcedimentoService procedimentoService;

    public ProcedimentoController(ProcedimentoService procedimentoService) {
        this.procedimentoService = procedimentoService;
    }

    @PostMapping
    public ResponseEntity<Procedimento> createProcedimento(@RequestBody Procedimento procedimento) {
        Procedimento novoProcedimento = procedimentoService.save(procedimento);
        return new ResponseEntity<>(novoProcedimento, HttpStatus.CREATED);
    }
}
