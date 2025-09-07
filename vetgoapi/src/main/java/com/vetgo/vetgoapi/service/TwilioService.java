package com.vetgo.vetgoapi.service;

import com.twilio.Twilio;
import com.twilio.rest.verify.v2.service.Verification;
import com.twilio.rest.verify.v2.service.VerificationCheck;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


@Service
public class TwilioService {

    @Value("${twilio.accountSid}")
    private String accountSid;

    @Value("${twilio.authToken}")
    private String authToken;

    @Value("${twilio.verifyServiceSid}")
    private String verifyServiceSid;

    private boolean initialized = false;

    private void init() {
        if (!initialized) {
            Twilio.init(accountSid, authToken);
            initialized = true;
        }
    }

    // Enviar código via WhatsApp
    public String sendCode(String phone) {
        init();
            Verification verification = Verification.creator(
                    verifyServiceSid,
                    "whatsapp:+55" + phone,  // aqui você usa o parâmetro phone
                    "whatsapp"
            ).create();
        return verification.getStatus(); // "pending"
    }

    // Validar código
    public String verifyCode(String phone, String code) {
        init();
        VerificationCheck check = VerificationCheck.creator(verifyServiceSid)
                .setTo("whatsapp:" + phone)
                .setCode(code)
                .create();
        return check.getStatus(); // "approved" se válido
    }
}