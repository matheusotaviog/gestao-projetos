
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
