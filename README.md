# Gestão de Projetos

Projeto final da Formação de Desenvolvedor Full Stack (+praTi).

## Pré-requisitos

- Docker e Docker Compose
- Java 17 ou superior
- Maven
- Postman (ou Insomnia)

## 1. Subir o banco de dados

Na raiz do projeto, crie o arquivo `.env` com:

```env
DB_USER=admin
DB_PASS=sua_senha
DB_NAME=gestao_projetos
```

Depois suba o PostgreSQL:

```bash
docker compose up -d
```

> Se aparecer `address already in use` na porta 5432, pare o PostgreSQL local: `sudo systemctl stop postgresql`.

## 2. Configurar o backend

Crie o arquivo `backend/.env` a partir do exemplo:

```bash
cp backend/.env.example backend/.env
```

Edite `backend/.env`. A `DB_PASSWORD` precisa ser igual à `DB_PASS` usada no Docker. A `JWT_SECRET` precisa ter pelo menos 32 caracteres.

O Spring Boot não lê o `.env` sozinho. Carregue as variáveis no terminal antes de rodar:

```bash
cd backend
set -a; source .env; set +a
```

## 3. Rodar a aplicação

No mesmo terminal:

```bash
mvn spring-boot:run
```

Quando aparecer `Started Application`, a API está em `http://localhost:8080`.

## 4. Testar no Postman

Ordem obrigatória: primeiro crie um usuário, depois um projeto que aponte para ele.

### Usuários

| Método | URL | Corpo (JSON) |
|---|---|---|
| POST | `/api/usuarios` | `{"nome": "João Silva", "email": "joao@email.com", "senha": "123456", "telefone": "11999999999"}` |
| GET | `/api/usuarios` | — |
| GET | `/api/usuarios/{id}` | — |
| PUT | `/api/usuarios/{id}` | `{"nome": "João Atualizado", "telefone": "11888888888"}` |
| DELETE | `/api/usuarios/{id}` | — |

### Projetos

| Método | URL | Corpo (JSON) |
|---|---|---|
| POST | `/api/projetos` | `{"nome": "Maratona de programação", "descricao": "Estudar algoritmos", "usuario": {"id": 1}}` |
| GET | `/api/projetos` | — |
| GET | `/api/projetos/{id}` | — |
| PUT | `/api/projetos/{id}` | `{"nome": "Novo nome", "descricao": "Nova descrição"}` |
| DELETE | `/api/projetos/{id}` | — |

Use o `id` retornado pelo POST de usuário no campo `usuario.id` do projeto.

Por enquanto esses endpoints não exigem token.

## Solução de problemas

- **`password authentication failed for user "admin"`**: a senha do `backend/.env` não bate com a do Docker. Recrie o banco com `docker compose down -v && docker compose up -d`. Isso apaga os dados.
- **`Could not resolve placeholder 'DB_URL'`**: as variáveis não foram carregadas. Rode `set -a; source .env; set +a` no mesmo terminal antes do `mvn`.
- **`403 Forbidden`**: reinicie o backend após mudar o `SecurityConfig`.
- **`400` ao criar projeto com `Key (usuario_id)=(1) is not present`**: o usuário informado não existe. Crie o usuário primeiro.
