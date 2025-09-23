package com.vetgo.vetgoapi.service;

import org.springframework.stereotype.Service;

import com.vetgo.vetgoapi.model.Procedimento;
import com.vetgo.vetgoapi.repository.ProcedimentoRepository;

@Service
public class ProcedimentoService {

    private final ProcedimentoRepository procedimentoRepository;

    public ProcedimentoService(ProcedimentoRepository procedimentoRepository) {
        this.procedimentoRepository = procedimentoRepository;
    }

    public Procedimento save(Procedimento procedimento) {
        return procedimentoRepository.save(procedimento);
    }
}
