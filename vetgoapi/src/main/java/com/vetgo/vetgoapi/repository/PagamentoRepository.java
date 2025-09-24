package com.vetgo.vetgoapi.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vetgo.vetgoapi.model.EStatusPagamento;
import com.vetgo.vetgoapi.model.Pagamento;

@Repository
public interface PagamentoRepository extends JpaRepository<Pagamento, Long> {

    List<Pagamento> findByResponsavelId(Long responsavelId);

    List<Pagamento> findByStatus(EStatusPagamento status);

    // Adicionado: Encontra um pagamento pelo ID do atendimento
    Optional<Pagamento> findByAtendimentoId(Long id);
}