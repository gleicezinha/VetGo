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

    // Normaliza o telefone e adiciona o código do Brasil se necessário
    public String normalizePhone(String phone) {
        String numbersOnly = phone.replaceAll("\\D", ""); // remove tudo que não for número

        // Se não começar com 55, adiciona o código do Brasil
        if (!numbersOnly.startsWith("55")) {
            numbersOnly = "55" + numbersOnly;
        }

        return numbersOnly;
    }

    // Envia o código de verificação
    public String sendCode(String phone) {
        String normalizedPhone = normalizePhone(phone);
        System.out.println("Telefone normalizado enviado para a API: " + normalizedPhone); // Linha de log para depuração

        String code = String.valueOf(new Random().nextInt(900000) + 100000); // código 6 dígitos
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

    // Valida o código de verificação
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