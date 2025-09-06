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

    public void init() {
        Twilio.init(accountSid, authToken);
    }

    public Verification sendCode(String phone) {
        init();
        return Verification.creator(
                verifyServiceSid,
                "whatsapp:" + phone,
                "whatsapp"
        ).create();
    }

    public VerificationCheck verifyCode(String phone, String code) {
        init();
        return VerificationCheck.creator(verifyServiceSid)
                .setTo("whatsapp:" + phone)
                .setCode(code)
                .create();
    }
}