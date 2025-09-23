package com.vetgo.vetgoapi.controller.dto;
import com.vetgo.vetgoapi.model.Responsavel;

public class ResponsavelDTO {

    private Long id;
    private String nome;
    private String email;
    private String telefone;
    private String statusPagamento; // Ex: PAGO ou PENDENTE

  public ResponsavelDTO(Responsavel responsavel, String statusPagamento) {
        this.id = responsavel.getId();
        this.nome = responsavel.getUsuario().getNomeUsuario();
        this.email = responsavel.getUsuario().getEmail();
        this.telefone = responsavel.getUsuario().getTelefone();
        this.statusPagamento = statusPagamento;
    }

public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public String getEmail() {
        return email;
    }

    public String getTelefone() {
        return telefone;
    }

    public String getStatusPagamento() {
        return statusPagamento;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public void setStatusPagamento(String statusPagamento) {
        this.statusPagamento = statusPagamento;
    }
}