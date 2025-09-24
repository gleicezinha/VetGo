package com.vetgo.vetgoapi.controller.dto;

import java.util.List;
import com.vetgo.vetgoapi.model.Endereco;

public class ResponsavelDTO {

    private Long id;
    private String nomeUsuario;
    private String email;
    private String telefone;
    private Endereco endereco; // <-- adiciona o endereço

    // Lista de status de pagamento resumido por atendimento
    private List<String> statusPagamentos;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNomeUsuario() { return nomeUsuario; }
    public void setNomeUsuario(String nomeUsuario) { this.nomeUsuario = nomeUsuario; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }

    public Endereco getEndereco() { return endereco; }
    public void setEndereco(Endereco endereco) { this.endereco = endereco; }

    public List<String> getStatusPagamentos() { return statusPagamentos; }
    public void setStatusPagamentos(List<String> statusPagamentos) { this.statusPagamentos = statusPagamentos; }
}
