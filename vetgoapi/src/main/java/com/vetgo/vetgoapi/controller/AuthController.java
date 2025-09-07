package com.vetgo.vetgoapi.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.vetgo.vetgoapi.controller.dto.PhoneRequest;
import com.vetgo.vetgoapi.controller.dto.VerifyRequest;
import com.vetgo.vetgoapi.model.EPapel;
import com.vetgo.vetgoapi.model.Usuario;
import com.vetgo.vetgoapi.repository.ProfissionalRepository;
import com.vetgo.vetgoapi.repository.ResponsavelRepository;
import com.vetgo.vetgoapi.service.UsuarioService;
import com.vetgo.vetgoapi.service.WhapiService;
import com.vetgo.vetgoapi.service.exception.ResourceNotFoundException;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final WhapiService whapiService;
    private final UsuarioService usuarioService;
    private final ResponsavelRepository responsavelRepository;
    private final ProfissionalRepository profissionalRepository;

    public AuthController(WhapiService whapiService, UsuarioService usuarioService,
                          ResponsavelRepository responsavelRepository,
                          ProfissionalRepository profissionalRepository) {
        this.whapiService = whapiService;
        this.usuarioService = usuarioService;
        this.responsavelRepository = responsavelRepository;
        this.profissionalRepository = profissionalRepository;
    }

    @PostMapping("/send-code")
    public ResponseEntity<?> sendCode(@RequestBody PhoneRequest request) {
        try {
            usuarioService.getByTelefone(request.getPhone())
                    .orElseThrow(() -> new ResourceNotFoundException("Telefone não cadastrado."));
            
            String status = whapiService.sendCode(request.getPhone());
            Map<String, String> response = new HashMap<>();
            response.put("status", status);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Erro interno ao enviar o código."));
        }
    }

   @PostMapping("/verify-code")
public ResponseEntity<?> verifyCode(@RequestBody VerifyRequest request) {
    // Normaliza telefone
    String telefone = request.getPhone().replaceAll("\\D", "");
    String whapiStatus = whapiService.verifyCode(telefone, request.getCode());

    if (!"approved".equals(whapiStatus)) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Código de verificação inválido.");
    }

    // Busca ou cria o usuário
    Optional<Usuario> usuarioOpt = usuarioService.getByTelefone(telefone);

    Usuario usuario;
    if (usuarioOpt.isEmpty()) {
        usuario = new Usuario();
        usuario.setTelefone(telefone);
        usuario.setPapel(EPapel.ROLE_RESPONSAVEL); // Por padrão, novos usuários são responsáveis
        usuario = usuarioService.save(usuario);
    } else {
        usuario = usuarioOpt.get();

        // Se o papel estiver nulo, defina com base em alguma lógica ou padrão
        if (usuario.getPapel() == null) {
            // Aqui você pode escolher o padrão, por exemplo RESPONSAVEL
            usuario.setPapel(EPapel.ROLE_RESPONSAVEL);
        }
    }

    // Retorna perfil completo baseado no papel
    if (usuario.getPapel() == EPapel.ROLE_RESPONSAVEL) {
        return responsavelRepository.findByUsuario(usuario)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.ok(usuario));
    } else if (usuario.getPapel() == EPapel.ROLE_PROFISSIONAL) {
        return profissionalRepository.findByUsuario(usuario)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.ok(usuario));
    }

    return ResponseEntity.ok(usuario);
}

}