package com.vetgo.vetgoapi.model;

import java.io.Serializable;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "tutor") // O nome da tabela no banco é "tutor"
public class Responsavel implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tutor") // Nome da coluna da chave primária
    private Long id;

    // Relação Um-para-Um: Um Responsavel está ligado a um único Usuario
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "id_usuario", referencedColumnName = "id", unique = true) // Define a FK para a tabela 'usuario'
    private Usuario usuario;

    // Getters e Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
}