package com.vetgo.vetgoapi.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Configura a cadeia de filtros de segurança para permitir todas as requisições.
     * Ideal para a fase de desenvolvimento e testes com Postman.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Desabilita a proteção contra CSRF, que não é necessária para uma API stateless
            .csrf(csrf -> csrf.disable()) 
            
            // Configura as regras de autorização
            .authorizeHttpRequests(auth -> auth
                // Permite que qualquer requisição (anyRequest) seja acessada sem autenticação (permitAll)
                .anyRequest().permitAll() 
            );
            
        // Constrói e retorna a cadeia de filtros de segurança
        return http.build();
    }
}