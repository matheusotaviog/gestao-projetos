# Frontend

Interface web do projeto **Processos — Gestão de Estudos e Tarefas**.

## Tecnologias

- React
- TypeScript
- Vite
- React Router
- CSS Modules
- Vitest
- Testing Library

## Requisitos

- Node.js 24
- npm 12

As versões acima correspondem ao ambiente utilizado na criação da estrutura inicial.

## Instalação

Na pasta `frontend`, instale as dependências:

```bash
npm install
```

## Execução local

```bash
npm run dev
```

O Vite informará o endereço local da aplicação, normalmente:

```text
http://localhost:5173
```

## Comandos disponíveis

```bash
npm run dev
```

Inicia o servidor de desenvolvimento.

```bash
npm run test
```

Executa os testes uma vez.

```bash
npm run test:watch
```

Mantém os testes em execução durante o desenvolvimento.

```bash
npm run lint
```

Verifica problemas de qualidade e consistência no código.

```bash
npm run build
```

Valida o TypeScript e gera a versão de produção em `dist`.

```bash
npm run preview
```

Executa localmente a versão gerada pelo build.

## Variáveis de ambiente

Copie o arquivo de exemplo:

### Windows

```bat
copy .env.example .env.local
```

### Linux ou macOS

```bash
cp .env.example .env.local
```

Variável prevista:

```text
VITE_API_BASE_URL=http://localhost:8080
```

A URL e o prefixo definitivo da API deverão ser confirmados com a equipe responsável pelo backend.

Arquivos `.env` reais não devem ser enviados ao Git.

## Estrutura principal

```text
src/
├─ app/
│  ├─ App.tsx
│  ├─ router.test.tsx
│  └─ router.tsx
├─ components/
│  ├─ layout/
│  └─ ui/
├─ styles/
├─ test/
└─ main.tsx
```

Funcionalidades futuras deverão ser organizadas em `src/features` conforme forem implementadas.

## Rotas reservadas

| Rota | Finalidade |
|---|---|
| `/` | Dashboard |
| `/login` | Autenticação |
| `/cadastro` | Cadastro de usuário |
| `/projetos` | Projetos |
| `/projetos/:projetoId` | Detalhes de um projeto |
| `/tarefas` | Tarefas |
| `/cronograma` | Cronograma |

As páginas atuais são provisórias. Elas reservam a navegação sem antecipar funcionalidades de sprints posteriores.

## Verificação antes de um Pull Request

Execute:

```bash
npm run test
npm run lint
npm run build
```

As três verificações devem terminar sem erros.

## Fora do escopo da estrutura inicial

- Autenticação funcional
- Integração com a API
- CRUD de projetos e tarefas
- Cronograma funcional
- Dashboard com dados reais
- Notificações e lembretes