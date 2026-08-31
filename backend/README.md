# Backend

API do projeto **Gestão de Projetos e Cronogramas**.

> As instruções de build e execução da aplicação Spring serão adicionadas quando o módulo for criado. Por enquanto, este README cobre a preparação do banco de dados, que é pré-requisito para rodar a API.

## Requisitos

- PostgreSQL 15 em execução

## Banco de dados

O schema é versionado em `sql/01-tabelas-iniciais.sql` (na raiz do repositório) e deve ser aplicado **manualmente**, antes de iniciar a API. O script cria as tabelas `usuario`, `projeto`, `cronograma`, `tarefa` e `cronograma_tarefa`.

Para aplicar:

1. Abra o pgAdmin e conecte-se ao seu servidor PostgreSQL.
2. Crie um banco de dados para o projeto (ex.: `gestao_projetos`).
3. Abra a Query Tool nesse banco, cole o conteúdo de `sql/01-tabelas-iniciais.sql` e execute.

> Quando o Docker estiver devidamente configurado, esta seção será ajustada para descrever o processo automatizado.

## Variáveis de ambiente

Copie o arquivo de exemplo:

### Windows

```bat
copy .env.example .env
```

### Linux ou macOS

```bash
cp .env.example .env
```

Variáveis previstas:

| Variável | Descrição |
|---|---|
| `DB_URL` | URL JDBC do PostgreSQL, ex.: `jdbc:postgresql://localhost:5432/gestao_projetos` |
| `DB_USERNAME` | Usuário do banco |
| `DB_PASSWORD` | Senha do banco |
| `JWT_SECRET` | Segredo usado para assinar os tokens JWT |

Arquivos `.env` reais não devem ser enviados ao Git.
