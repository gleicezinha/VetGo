package com.vetgo.vetgoapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

// A anotação abaixo desliga completamente a configuração de segurança do Spring
@SpringBootApplication(exclude = {SecurityAutoConfiguration.class})
public class VetgoapiApplication {

	public static void main(String[] args) {
		SpringApplication.run(VetgoapiApplication.class, args);
	}

}