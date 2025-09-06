package com.vetgo.vetgoapi.controller;

import com.vetgo.vetgoapi.service.TwilioService;
import com.twilio.rest.verify.v2.service.Verification;
import com.twilio.rest.verify.v2.service.VerificationCheck;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final TwilioService twilioService;

    @Autowired
    public AuthController(TwilioService twilioService) {
        this.twilioService = twilioService;
    }

    @PostMapping("/send-code")
    public ResponseEntity<String> sendCode(@RequestParam String phone) {
        try {
            Verification verification = twilioService.sendCode(phone);
            return ResponseEntity.ok("Código enviado! Status: " + verification.getStatus());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao enviar código: " + e.getMessage());
        }
    }

    @PostMapping("/verify-code")
    public ResponseEntity<String> verifyCode(@RequestParam String phone, @RequestParam String code) {
        try {
            VerificationCheck check = twilioService.verifyCode(phone, code);
            return ResponseEntity.ok("Status da verificação: " + check.getStatus());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro na verificação: " + e.getMessage());
        }
    }
}