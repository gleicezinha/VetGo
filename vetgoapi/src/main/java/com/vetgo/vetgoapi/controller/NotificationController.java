package com.vetgo.vetgoapi.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController; // MODIFICADO: Importado RequestMapping

import com.vetgo.vetgoapi.service.NotificationService;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    /**
     * Endpoint para acionar manualmente o envio de lembretes para o dia seguinte.
     * Útil para testes. Agora aceita GET e POST.
     */
    @RequestMapping("/trigger-reminders") // MODIFICADO: Usando @RequestMapping para aceitar qualquer método
    public ResponseEntity<String> triggerReminders() {
        notificationService.findAndSendRemindersForTomorrow();
        return ResponseEntity.ok("Processo de envio de lembretes acionado manualmente com sucesso.");
    }
}