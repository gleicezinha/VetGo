package main.java.com.vetgo.api.model;

import java.io.Serializable;
import java.time.LocalDate;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Paciente implements Serializable{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false)
    private Long id;

    @Column(nullable = false)
    private String nomeCompleto;

    @Column(nullable = false, unique = true)
    private String cpf;

    @Column(nullable = false)
    private String nomeResponsavel;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private EEspecie especie;
    
    private String peso;

    private String estado;

    private String endereco;

    private String bairro;

    private String cep;

    private String telefone;

    
    @Column(nullable = false)
    private LocalDate dataNascimento;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ESexo sexo;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNomeCompleto() {
        return nomeCompleto;
    }

    public void setNomeCompleto(String nomeCompleto) {
        this.nomeCompleto = nomeCompleto;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }
    
    public String getNomeResponsavel() {
        return nomeResponsavel;
    }
    public void setNomeResponsavel(String nomeResponsavel) {
        this.nomeResponsavel = nomeResponsavel;
    }

    public String getPeso(){
        return peso;
    }
    
    public void setPeso(String peso) {
        this.peso = peso;
    }

    public String getEspecie() {
        return animal;
    }

    public void setEspecie(String especie) {
        this.especie = especie;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public String getBairro() {
        return bairro;
    }

    public void setBairro(String bairro) {
        this.bairro = bairro;
    }

    public String getCep() {
        return cep;
    }

    public void setCep(String cep) {
        this.cep = cep;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }


    public LocalDate getDataNascimento() {
        return dataNascimento;
    }

    public void setDataNascimento(LocalDate dataNascimento) {
        this.dataNascimento = dataNascimento;
    }

    public ESexo getSexo() {
        return sexo;
    }

    public void setSexo(ESexo sexo) {
        this.sexo = sexo;
    }

}