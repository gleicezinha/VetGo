package com.vetgo.vetgoapi.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class WhapiService {

    @Value("${whapi.token}")
    private String token;

    private final RestTemplate restTemplate = new RestTemplate();
    private final Map<String, String> codes = new ConcurrentHashMap<>();

    private String normalizePhone(String phone) {
        return phone.replaceAll("\\D", ""); // remove tudo que não for número
    }

    // Envia o código
    public String sendCode(String phone) {
        String normalizedPhone = normalizePhone(phone);

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

    // Valida o código
    public String verifyCode(String phone, String code) {
        String normalizedPhone = normalizePhone(phone);
        String storedCode = codes.get(normalizedPhone);

        if (storedCode != null && storedCode.equals(code)) {
            codes.remove(normalizedPhone);
            return "approved";
        }
        return "denied";
    }
}
