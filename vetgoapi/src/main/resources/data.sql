-- Inserts para a tabela 'endereco'
INSERT INTO endereco (id_endereco, logradouro, numero, complemento, bairro, cidade, estado, cep) VALUES
(1, 'Rua das Flores', '123', 'Apto 101', 'Centro', 'São Paulo', 'SP', '01000000'),
(2, 'Avenida Brasil', '456', 'Casa', 'Jardins', 'Rio de Janeiro', 'RJ', '20000000'),
(3, 'Rua da Tecnologia', '789', NULL, 'Liberdade', 'Belo Horizonte', 'MG', '30000000'),
(4, 'Rua da Floresta', '500', NULL, 'Centro', 'Rio Branco', 'AC', '69900000'),
(5, 'Travessa das Águas', '10', 'Casa', 'Bairro do Lago', 'Cruzeiro do Sul', 'AC', '69980000'),
(6, 'Rua da Paz', '210', 'Bloco B', 'Vila Nova', 'Curitiba', 'PR', '80000000'),
(7, 'Avenida Principal', '800', NULL, 'Centro', 'Porto Alegre', 'RS', '90000000'),
(8, 'Rua Sete de Setembro', '150', NULL, 'Boa Viagem', 'Recife', 'PE', '50000000'),
(9, 'Avenida Paulista', '1700', 'Conj. 502', 'Bela Vista', 'São Paulo', 'SP', '01311200'),
(10, 'Rua Quinze de Novembro', '300', NULL, 'Centro', 'Florianópolis', 'SC', '88000000');

-- Inserts para a tabela 'usuario'
INSERT INTO usuario (id, nome_usuario, email, telefone, cpf, ativo, papel, endereco_id_fk) VALUES
(1, 'Rayssa Gabriela', 'ao.silva@vetgo.com', '68992020638', '11122233344', true, 'ROLE_PROFISSIONAL', 1),
(2, 'maria oliveira', 'maria.o@email.com', '6899392476', '55566677788', true, 'ROLE_RESPONSAVEL', 2),
(3, 'pedro admin', 'pedro.admin@email.com', '68992020639', '99988877766', true, 'ROLE_ADMIN', 3),
(4, 'gleice mourao', 'mourao.gleice@vetgo.com', '68999991111', '44455566677', true, 'ROLE_RESPONSAVEL', 4),
(5, 'carlos santos', 'carlos.santos@email.com', '68988882222', '12345678901', true, 'ROLE_RESPONSAVEL', 5),
(6, 'ana souza', 'ana.souza@email.com', '41998765432', '12312312312', true, 'ROLE_RESPONSAVEL', 6),
(7, 'fernanda lima', 'fernanda.lima@email.com', '51987654321', '32132132132', true, 'ROLE_RESPONSAVEL', 7),
(8, 'roberto gomes', 'roberto.gomes@vetgo.com', '81977778888', '78978978978', true, 'ROLE_PROFISSIONAL', 8),
(9, 'carolina alves', 'carolina.alves@email.com', '11999990000', '98765432109', true, 'ROLE_RESPONSAVEL', 9),
(10, 'lucas costa', 'lucas.costa@email.com', '48988881111', '09876543210', true, 'ROLE_RESPONSAVEL', 10);

-- Inserts para a tabela 'tutor' (Responsavel)
INSERT INTO tutor (id_tutor, id_usuario) VALUES
(1, 2),
(2, 5),
(3, 4),
(4, 6),
(5, 7),
(6, 9),
(7, 10);

-- Inserts para a tabela 'profissional'
INSERT INTO profissional (id, registro, usuario_id_fk) VALUES
(1, 'CRMV-AC 12345', 1),
(2, 'CRMV-PE 54321', 8);

-- Inserts para a tabela 'pet' (Paciente)
INSERT INTO pet (id_pet, id_tutor, nome, especie, raca, sexo, data_nascimento, situacao) VALUES
(1, 1, 'Rex', 'CACHORRO', 'Golden Retriever', 'M', '2020-05-10', 'VIVO'),
(2, 1, 'Mimi', 'GATO', 'Siamês', 'F', '2019-11-22', 'VIVO'),
(3, 2, 'Bilu', 'CACHORRO', 'Vira-Lata', 'M', '2023-01-05', 'VIVO'),
(4, 3, 'Mia', 'GATO', 'Vira-lata', 'F', '2023-06-01', 'VIVO'),
(5, 4, 'Fred', 'CACHORRO', 'Poodle', 'M', '2021-02-15', 'VIVO'),
(6, 4, 'Luna', 'GATO', 'Persa', 'F', '2022-07-30', 'VIVO'),
(7, 5, 'Thor', 'CACHORRO', 'Husky Siberiano', 'M', '2021-12-12', 'VIVO'),
(8, 6, 'Belinha', 'CACHORRO', 'Dachshund', 'F', '2022-03-03', 'VIVO'),
(9, 7, 'Max', 'GATO', 'Ragdoll', 'M', '2023-04-18', 'VIVO');

-- Inserts para a tabela 'atendimento'
INSERT INTO atendimento (id, data_hora_atendimento, profissional_id, paciente_id, status, tipo_de_atendimento, id_pai) VALUES
(1, '2025-08-20 10:00:00', 1, 1, 'AGENDADO', 'CONSULTA', NULL),
(2, '2025-08-15 14:30:00', 1, 2, 'ENCERRADO', 'VACINACAO', NULL),
(3, '2025-08-25 11:00:00', 1, 1, 'AGENDADO', 'RETORNO', 1),
(4, '2025-09-01 09:00:00', 1, 5, 'AGENDADO', 'CONSULTA', NULL),
(5, '2025-09-05 15:00:00', 2, 6, 'AGENDADO', 'VACINACAO', NULL),
(6, '2025-09-08 11:30:00', 2, 7, 'AGENDADO', 'CONSULTA', NULL),
(7, '2025-09-10 10:00:00', 1, 8, 'AGENDADO', 'CONSULTA', NULL),
(8, '2025-09-12 16:00:00', 2, 9, 'AGENDADO', 'EXAME', NULL);

-- Inserts para a tabela 'historico_clinico'
INSERT INTO historico_clinico (id_historico, id_pet, data, descricao, observacoes) VALUES
(1, 1, '2025-08-15', 'Exame de rotina anual. Animal saudável.', 'Nenhuma observação relevante.'),
(2, 1, '2024-05-20', 'Vacina V8 aplicada.', 'Próxima dose em 1 ano.'),
(3, 2, '2025-08-15', 'Vacina felina V4 aplicada.', 'Animal reativo, mas cooperou.'),
(4, 5, '2025-09-01', 'Avaliação de check-up. Animal saudável.', 'Peso ideal para a raça.'),
(5, 6, '2025-09-05', 'Vacina antirrábica aplicada.', 'Aplicação sem intercorrências.');

-- Inserts para a tabela 'pagamento'
INSERT INTO pagamento (id_pagamento, id_tutor, id_consulta, descricao, valor, data_pagamento, status) VALUES
(1, 1, 2, 'Pagamento da consulta de vacinação de Mimi.', 150.00, '2025-08-15', 'PAGO'),
(2, 1, 1, 'Pagamento da consulta agendada de Rex.', 200.00, NULL, 'PENDENTE'),
(3, 4, 4, 'Pagamento da consulta de Fred.', 180.00, '2025-09-01', 'PAGO'),
(4, 5, 5, 'Pagamento da vacinação de Luna.', 150.00, '2025-09-05', 'PAGO'),
(5, 6, 6, 'Pagamento da consulta de Thor.', 200.00, NULL, 'PENDENTE');

-- Inserts para a tabela 'procedimento'
INSERT INTO procedimento (id_procedimento, id_pet, id_consulta, tipo, nome, data_atendimento, data_proxdose, dose, fabricante, lote, via_aplicacao, posologia, observacoes) VALUES
(1, 2, 2, 'VACINACAO', 'Vacina Felina V4', '2025-08-15', '2026-08-15', '1 mL', 'Zoetis', 'LOTE-X', 'Subcutânea', 'Aplicar 1 mL por via subcutânea.', 'Gato ficou estressado, mas a aplicação foi bem sucedida.'),
(2, 5, 4, 'VACINACAO', 'Vacina V10', '2025-09-01', '2026-09-01', '1 mL', 'Merial', 'LOTE-Y', 'Intramuscular', 'Aplicar 1 mL por via intramuscular.', 'Cachorro reagiu bem.'),
(3, 6, 5, 'VACINACAO', 'Vacina Antirrábica', '2025-09-05', '2026-09-05', '1 mL', 'Pfizer', 'LOTE-Z', 'Subcutânea', 'Aplicar 1 mL por via subcutânea.', 'Gato cooperativo.');