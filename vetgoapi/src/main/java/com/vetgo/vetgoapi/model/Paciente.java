package com.vetgo.vetgoapi.model;

import java.io.Serializable;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "pet")
public class Paciente implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pet")
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tutor", referencedColumnName = "id_tutor", nullable = false)
    private Responsavel responsavel;

    @Column(nullable = false)
    private String nome;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EEspecie especie;

    private String raca;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ESexo sexo;

    @Column(name = "data_nascimento", nullable = false)
    private LocalDate dataNascimento;

    // --- CAMPO NOVO ADICIONADO AQUI ---
    @Enumerated(EnumType.STRING) // Armazena "VIVO" ou "MORTO" no banco (RECOMENDADO)
    @Column(nullable = false)
    private ESituacao situacao;
    // ------------------------------------

    // --- Getters e Setters ---
    
    // ... (todos os outros getters e setters) ...

    public ESituacao getSituacao() {
        return situacao;
    }

    public void setSituacao(ESituacao situacao) {
        this.situacao = situacao;
    }

    // ... (resto da classe)
}