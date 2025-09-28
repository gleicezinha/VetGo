package com.vetgo.vetgoapi.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vetgo.vetgoapi.model.Pagamento;
import com.vetgo.vetgoapi.model.EStatusPagamento;
import com.vetgo.vetgoapi.model.Atendimento;
import com.vetgo.vetgoapi.model.EStatus;
import com.vetgo.vetgoapi.model.Responsavel;
import com.vetgo.vetgoapi.model.Usuario;
import com.vetgo.vetgoapi.repository.ResponsavelRepository;
import com.vetgo.vetgoapi.repository.UsuarioRepository;
import com.vetgo.vetgoapi.repository.AtendimentoRepository;
import com.vetgo.vetgoapi.service.exception.ResourceNotFoundException;

@Service
public class ResponsavelService implements ICrudService<Responsavel> {

    private final ResponsavelRepository responsavelRepository;
    private final UsuarioRepository usuarioRepository;
    private final PagamentoService pagamentoService;
    private final AtendimentoRepository atendimentoRepository;

    public ResponsavelService(ResponsavelRepository responsavelRepository, 
                              UsuarioRepository usuarioRepository,
                              PagamentoService pagamentoService,
                              AtendimentoRepository atendimentoRepository) {
        this.responsavelRepository = responsavelRepository;
        this.usuarioRepository = usuarioRepository;
        this.pagamentoService = pagamentoService;
        this.atendimentoRepository = atendimentoRepository;
    }

    @Override
    public List<Responsavel> get(String termoBusca) {
        return responsavelRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public Page<Responsavel> getAllResponsaveis(Pageable pageable) {
        return responsavelRepository.findAll(pageable);
    }

    @Override
    public Responsavel get(Long id) {
        return responsavelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Responsável não encontrado com o ID: " + id));
    }

    public Optional<Responsavel> getByUsuarioId(Long usuarioId) {
        Optional<Usuario> usuario = usuarioRepository.findById(usuarioId);
        
        if (usuario.isPresent() && usuario.get().getPapel().toString().equals("ROLE_RESPONSAVEL")) {
             return responsavelRepository.findByUsuario(usuario.get());
        }
        
        return Optional.empty();
    }
    
    @Override
    @Transactional
    public Responsavel save(Responsavel objeto) {
        if(objeto.getId() == null) {
            return responsavelRepository.save(objeto);
        } else {
            Responsavel responsavelExistente = this.get(objeto.getId());
            if (responsavelExistente != null && responsavelExistente.getUsuario() != null) {
                Usuario usuarioExistente = responsavelExistente.getUsuario();
                Usuario usuarioAtualizado = objeto.getUsuario();
                
                if (usuarioAtualizado != null) {
                    usuarioExistente.setNomeUsuario(usuarioAtualizado.getNomeUsuario());
                    usuarioExistente.setTelefone(usuarioAtualizado.getTelefone());
                    
                    if (usuarioExistente.getEndereco() != null && usuarioAtualizado.getEndereco() != null) {
                        var endExistente = usuarioExistente.getEndereco();
                        var endAtualizado = usuarioAtualizado.getEndereco();
                        endExistente.setCep(endAtualizado.getCep());
                        endExistente.setBairro(endAtualizado.getBairro());
                        endExistente.setEstado(endAtualizado.getEstado());
                        endExistente.setComplemento(endAtualizado.getComplemento());
                        endExistente.setLogradouro(endAtualizado.getLogradouro());
                        endExistente.setNumero(endAtualizado.getNumero());
                        endExistente.setCidade(endAtualizado.getCidade());
                    }

                    return responsavelRepository.save(responsavelExistente);
                } else {
                    throw new IllegalArgumentException("Objeto Usuario não pode ser nulo para a atualização.");
                }
            } else {
                throw new ResourceNotFoundException("Responsável não encontrado para atualização.");
            }
        }
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!responsavelRepository.existsById(id)) {
            throw new ResourceNotFoundException("Responsável não encontrado com o ID: " + id);
        }
        responsavelRepository.deleteById(id);
    }
    
    public Optional<Responsavel> getByTelefone(String telefone) {
        return responsavelRepository.findByUsuario_Telefone(telefone);
    }

    // MÉTODO MODIFICADO: Calcula o status agregado (PAGO, PENDENTE_AMARELO|ID, PENDENTE_VERMELHO|ID)
    public List<String> getOverallPaymentStatus(Responsavel responsavel) {
        
        // 1. Obtém todos os atendimentos não cancelados para este responsável.
        List<Atendimento> atendimentos = atendimentoRepository.findByResponsavelId(responsavel.getId());
        
        List<Atendimento> atendimentosRelevantes = atendimentos.stream()
            .filter(a -> a.getStatus() != EStatus.CANCELADO)
            .collect(Collectors.toList());
            
        // Se não houver atendimentos relevantes, o cliente está "em dia" (sem dívidas).
        if (atendimentosRelevantes.isEmpty()) {
             return List.of("PAGO|N/A"); 
        }
        
        for (Atendimento atendimento : atendimentosRelevantes) {
            
            // 2. Verifica se um registro de pagamento existe para o atendimento
            Optional<Pagamento> pagamentoOpt = pagamentoService.getByAtendimentoIdOptional(atendimento.getId());
            
            if (pagamentoOpt.isEmpty()) {
                // Cenário 1: Não há registro de pagamento (PENDENTE AMARELO - FALTA DE INPUT)
                return List.of("PENDENTE_AMARELO|" + atendimento.getId()); 
            }
            
            Pagamento pagamento = pagamentoOpt.get();
            if (pagamento.getStatus() == EStatusPagamento.PENDENTE) {
                // Cenário 2: Registro existe, mas o status é PENDENTE (PENDENTE VERMELHO - DÍVIDA)
                return List.of("PENDENTE_VERMELHO|" + atendimento.getId()); 
            }
        }
        
        // Cenário 3: Se o loop terminar, TUDO está PAGO.
        return List.of("PAGO|N/A"); 
    }
    
    // Método original (mantido por utilidade)
    public List<String> getStatusPagamentosByResponsavel(Responsavel responsavel) {
        return pagamentoService.getPagamentosByResponsavel(responsavel).stream()
                .map(Pagamento::getStatus)
                .map(Enum::name)
                .collect(Collectors.toList());
    }
}