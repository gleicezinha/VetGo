package com.vetgo.vetgoapi.service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;


@Service
public class WhapiService {

    @Value("${whapi.token}")
    private String token;

    private final RestTemplate restTemplate = new RestTemplate();
    private final Map<String, String> codes = new ConcurrentHashMap<>();

    public String normalizePhone(String phone) {
        String numbersOnly = phone.replaceAll("\\D", "");
        if (!numbersOnly.startsWith("55")) {
            numbersOnly = "55" + numbersOnly;
        }
        return numbersOnly;
    }

    public String sendCode(String phone) {
        String normalizedPhone = normalizePhone(phone);
        System.out.println("Telefone normalizado enviado para a API: " + normalizedPhone);

        String code = String.valueOf(new Random().nextInt(900000) + 100000);
        codes.put(normalizedPhone, code);

        String url = "https://gate.whapi.cloud/messages/text";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(token);

        Map<String, String> body = new HashMap<>();
        body.put("to", normalizedPhone);
        body.put("body", "Seu código de verificação é: " + code);

        HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            if (response.getStatusCode().is2xxSuccessful()) {
                return "pending";
            } else {
                return "failed";
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "error";
        }
    }

    public String verifyCode(String phone, String code) {
        String normalizedPhone = normalizePhone(phone);
        String storedCode = codes.get(normalizedPhone);

        if (storedCode != null && storedCode.equals(code)) {
            codes.remove(normalizedPhone);
            return "approved";
        }
        return "denied";
    }
    
    // Método para enviar mensagens genéricas (usado pelas notificações)
    public boolean sendMessage(String phone, String message) {
        String normalizedPhone = normalizePhone(phone);
        String url = "https://gate.whapi.cloud/messages/text";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(token);

        Map<String, String> body = new HashMap<>();
        body.put("to", normalizedPhone);
        body.put("body", message);

        HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}