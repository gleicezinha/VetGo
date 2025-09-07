INSERT INTO endereco (id_endereco, logradouro, numero, complemento, bairro, cidade, estado, cep) VALUES
(1, 'Rua das Flores', '123', 'Apto 101', 'Centro', 'São Paulo', 'SP', '01000000'),
(2, 'Avenida Brasil', '456', 'Casa', 'Jardins', 'Rio de Janeiro', 'RJ', '20000000'),
(3, 'Rua da Tecnologia', '789', NULL, 'Liberdade', 'Belo Horizonte', 'MG', '30000000'),
(4, 'Rua da Floresta', '500', NULL, 'Centro', 'Rio Branco', 'AC', '69900000'),
(5, 'Travessa das Águas', '10', 'Casa', 'Bairro do Lago', 'Cruzeiro do Sul', 'AC', '69980000');

-- Inserts para a tabela 'usuario'
-- CORREÇÃO: nomeUsuario alterado para nome_usuario
INSERT INTO usuario (id, nome_usuario, email, telefone, cpf, ativo, papel, endereco_id_fk) VALUES
(1, 'rayssa silva',  'joao.silva@vetgo.com', '5568992020638', '11122233344', true, 'ROLE_PROFISSIONAL', 1),
(2, 'maria oliveira', 'maria.o@email.com', '21988887777', '55566677788', true, 'ROLE_RESPONSAVEL', 2),
(3, 'pedro admin', 'pedro.admin@email.com', '31977776666', '99988877766', true, 'ROLE_ADMIN', 3),
(4, 'gleice mourao', 'mourao.gleice@vetgo.com', '68999991111', '44455566677', true, 'ROLE_RESPONSAVEL', 4),
(5, 'carlos santos',  'carlos.santos@email.com', '68988882222', '12345678901', true, 'ROLE_RESPONSAVEL', 5);

-- Inserts para a tabela 'tutor' (Responsavel)
INSERT INTO tutor (id_tutor, id_usuario) VALUES
(1, 2),
(2, 5),
(3, 4);

-- Inserts para a tabela 'profissional'
INSERT INTO profissional (id, registro, usuario_id_fk) VALUES
(1, 'CRMV-SP 12345', 1);

-- Inserts para a tabela 'pet' (Paciente)
-- CORREÇÃO: 'f' alterado para 'F' em sexo para corresponder ao enum
INSERT INTO pet (id_pet, id_tutor, nome, especie, raca, sexo, data_nascimento, situacao) VALUES
(1, 1, 'Rex', 'CACHORRO', 'Golden Retriever', 'M', '2020-05-10', 'VIVO'),
(2, 1, 'Mimi', 'GATO', 'Siamês', 'F', '2019-11-22', 'VIVO'),
(3, 2, 'Bilu', 'CACHORRO', 'Vira-Lata', 'M', '2023-01-05', 'VIVO'),
(4, 3, 'mia', 'GATO', 'vira-lata', 'F', '2023-06-01', 'VIVO');

-- Inserts para a tabela 'atendimento'
-- CORREÇÃO: dataDeAtendimento e horarioDeAtendimento unificados em data_hora_atendimento.
-- CORREÇÃO: tipoDeAtendimento e idPai alterados para snake_case.
INSERT INTO atendimento (id, data_hora_atendimento, profissional_id, paciente_id, status, tipo_de_atendimento, id_pai) VALUES
(1, '2025-08-20 10:00:00', 1, 1, 'AGENDADO', 'CONSULTA', NULL),
(2, '2025-08-15 14:30:00', 1, 2, 'ENCERRADO', 'VACINACAO', NULL),
(3, '2025-08-25 11:00:00', 1, 1, 'AGENDADO', 'RETORNO', 1);

-- Inserts para a tabela 'historico_clinico'
INSERT INTO historico_clinico (id_historico, id_pet, data, descricao, observacoes) VALUES
(1, 1, '2025-08-15', 'Exame de rotina anual. Animal saudável.', 'Nenhuma observação relevante.'),
(2, 1, '2024-05-20', 'Vacina V8 aplicada.', 'Próxima dose em 1 ano.'),
(3, 2, '2025-08-15', 'Vacina felina V4 aplicada.', 'Animal reativo, mas cooperou.');

-- Inserts para a tabela 'pagamento'
INSERT INTO pagamento (id_pagamento, id_tutor, id_consulta, descricao, valor, data_pagamento, status) VALUES
(1, 1, 2, 'Pagamento da consulta de vacinação de Mimi.', 150.00, '2025-08-15', 'PAGO'),
(2, 1, 1, 'Pagamento da consulta agendada de Rex.', 200.00, NULL, 'PENDENTE');

-- Inserts para a tabela 'procedimento'
-- CORREÇÃO: viaAplicacao e posologia alterados para snake_case.
INSERT INTO procedimento (id_procedimento, id_pet, id_consulta, tipo, nome, data_atendimento, data_proxdose, dose, fabricante, lote, via_aplicacao, posologia, observacoes) VALUES
(1, 2, 2, 'VACINACAO', 'Vacina Felina V4', '2025-08-15', '2026-08-15', '1 mL', 'Zoetis', 'LOTE-X', 'Subcutânea', 'Aplicar 1 mL por via subcutânea.', 'Gato ficou estressado, mas a aplicação foi bem sucedida.');