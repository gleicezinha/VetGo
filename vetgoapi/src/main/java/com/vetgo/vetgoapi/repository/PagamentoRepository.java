package com.vetgo.vetgoapi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vetgo.vetgoapi.model.EStatusPagamento;
import com.vetgo.vetgoapi.model.Pagamento;

@Repository
public interface PagamentoRepository extends JpaRepository<Pagamento, Long> {

    /**
     * Encontra todos os pagamentos de um determinado responsável (tutor).
     * @param responsavelId O ID do responsável.
     * @return Uma lista de pagamentos.
     */
    List<Pagamento> findByResponsavelId(Long responsavelId);

    /**
     * Encontra todos os pagamentos com um status específico.
     * @param status O status do pagamento (PENDENTE, PAGO, etc.).
     * @return Uma lista de pagamentos com o status fornecido.
     */
    List<Pagamento> findByStatus(EStatusPagamento status);
}