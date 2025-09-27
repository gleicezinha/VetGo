package com.vetgo.vetgoapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling; // 1. IMPORTE AQUI

@SpringBootApplication
@EnableScheduling // 2. ADICIONE ESTA ANOTAÇÃO
public class VetgoapiApplication {

	public static void main(String[] args) {
		SpringApplication.run(VetgoapiApplication.class, args);
	}

}