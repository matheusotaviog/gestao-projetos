
-- Tabela usuario
CREATE TABLE usuario (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    telefone VARCHAR(20),
    senha VARCHAR(255) NOT NULL,
    data_criacao TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabela projeto
CREATE TABLE projeto (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    data_criacao TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabela: cronograma
-- dia_semana: 0 = domingo, 1 = segunda, 2 = terça,
-- 3 = quarta, 4 = quinta,  5 = sexta,  6 = sábado.
CREATE TABLE cronograma (
    id SERIAL PRIMARY KEY,
    projeto_id INTEGER NOT NULL REFERENCES projeto(id) ON DELETE CASCADE,
    horario_inicio TIME NOT NULL,
    horario_fim TIME NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    observacao TEXT
);

-- Tabela: tarefa
CREATE TABLE tarefa (
    id SERIAL PRIMARY KEY,
    projeto_id INTEGER NOT NULL REFERENCES projeto(id) ON DELETE CASCADE,
    titulo VARCHAR(150) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pendente',
    data_entrega DATE,
    observacao TEXT,
    data_criacao TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabela cronograma_tarefa
-- Vincula uma Tarefa a um Cronograma (relação N:N).
CREATE TABLE cronograma_tarefa (
    id SERIAL PRIMARY KEY,
    cronograma_id INTEGER NOT NULL REFERENCES cronograma(id) ON DELETE CASCADE,
    tarefa_id INTEGER NOT NULL REFERENCES tarefa(id) ON DELETE CASCADE,
    UNIQUE (cronograma_id, tarefa_id)
);