// src/main/java/com/vetgo/vetgoapi/model/Profissional.java

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

@Entity
public class Profissional implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false)
    private Long id;


    
    @Column(nullable = false, unique = true)
    private String registro; 

   
    @OneToOne(cascade = CascadeType.ALL) 
    @JoinColumn(name = "usuario_id_fk", referencedColumnName = "id") 
    private Usuario usuario; 

  

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRegistro() {
        return registro;
    }

    public void setRegistro(String registro) {
        this.registro = registro;
    }
    
    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }


    @Override
    public String toString() {
        if (this.usuario != null) {
            return this.usuario.getNomeUsuario();
        }
        return "Profissional ID: " + this.id;
    }
}