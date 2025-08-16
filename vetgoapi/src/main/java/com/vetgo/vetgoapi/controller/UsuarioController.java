package com.vetgo.vetgoapi.controller;

import java.util.List;

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

import com.vetgo.vetgoapi.model.Usuario;
import com.vetgo.vetgoapi.service.UsuarioService;

@RestController
@RequestMapping("/config/usuario")
public class UsuarioController { // Não precisa implementar ICrudController se não for utilizá-lo

    private final UsuarioService servico;

    public UsuarioController(UsuarioService servico){
        this.servico = servico;
    }

    @GetMapping("/consultar/todos")
    public ResponseEntity<List<Usuario>> get(@RequestParam(required = false) String termoBusca) {
        var registros = servico.get(termoBusca);
        return ResponseEntity.ok(registros);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> get(@PathVariable Long id) {
        var registro = servico.get(id);
        return ResponseEntity.ok(registro);
    }

    @PostMapping("/inserir")
    public ResponseEntity<Usuario> insert(@RequestBody Usuario objeto) {
        Usuario registro = servico.save(objeto);
        return ResponseEntity.ok(registro);
    }

    @PutMapping("/atualizar")
    public ResponseEntity<Usuario> update(@RequestBody Usuario objeto) {
        Usuario registro = servico.save(objeto);
        return ResponseEntity.ok(registro);
    }

    @DeleteMapping("remover/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        servico.delete(id);
        return ResponseEntity.ok().build();
    }
    
}