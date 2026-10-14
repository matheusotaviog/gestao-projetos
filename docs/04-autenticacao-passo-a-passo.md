# Autenticação: cadastro, login e logout

Este guia mostra, na ordem certa, como construir o login e o logout do projeto. Cada etapa diz o que fazer, o porquê e como saber que funcionou.

> Termos: **cadastro** (signup) cria a conta. **login** (signin, "entrar") valida a senha e devolve um token. **logout** (signout, "sair") descarta o token no cliente.

## 1. Estado atual

Conferido no código do branch `feature/autenticacao`:

| Parte | Situação | Onde está |
|---|---|---|
| Cadastro no backend | Feito. Senha salva com BCrypt e não volta na resposta. | `UsuarioService`, `Usuario`, `SecurityConfig` |
| Tela de cadastro | Feita | `Pages/Cadastro/Cadastro.tsx` |
| Endpoint de login | **Falta** | — |
| Validação do token nas requisições | **Falta**: `JwtFilter` só repassa a requisição | `security/JwtFilter.java` |
| Rotas protegidas | **Falta**: `/api/usuarios` e `/api/projetos` ainda estão abertas | `SecurityConfig.java` |
| Tela de login | **Falta**: o arquivo é um placeholder | `Pages/Login/Login.tsx` |
| Contexto de autenticação | **Falta**: arquivo vazio | `Context/AuthContext.tsx` |
| Botão de sair no Header | **Falta** | `components/Header/Header.tsx` |

**Resposta direta:** ainda não dá para testar login e logout. O que dá para testar hoje é o cadastro, e mesmo ele depende de o backend conectar no banco com a senha do `backend/.env`.

## 2. Conceitos

- **BCrypt:** a senha não é guardada como foi digitada. Guardamos um resumo irreversível. No login, o Spring compara o resumo da senha digitada com o resumo salvo. Por isso, senhas antigas em texto puro não funcionam mais.
- **JWT:** um token assinado pelo servidor, com o e-mail do usuário e uma data de validade. Quem tem o token prova que fez login. O `JwtService` gera tokens válidos por 24 horas.
- **Stateless:** o servidor não guarda sessão. Por isso o logout é feito pelo cliente, que apaga o token. O token continua válido no servidor até expirar.

## 3. Passo a passo

### Passo 1: Cadastro (feito)

**O que foi feito:** o `UsuarioService.criar` aplica o `PasswordEncoder` antes de salvar, e o campo `senha` tem `WRITE_ONLY`, então nunca volta nas respostas.

**Como testar no Postman:**
- `POST http://localhost:8080/api/usuarios` com nome, e-mail e senha
- A resposta não pode ter o campo `senha`
- No banco, a coluna `senha` deve começar com `$2a$`

### Passo 2: DTO e serviço de login (backend)

**Objetivo:** validar e-mail e senha sem expor detalhes.

1. Crie um DTO `LoginRequest` com `email` e `senha`. O DTO é o formato que a API recebe, separado da entidade `Usuario`.
2. Crie `AuthService` com o método `login(email, senha)`:
   - busque o usuário com `UsuarioRepository.findByEmail`;
   - se não existir, ou se `passwordEncoder.matches(senha, hash)` for falso, lance a mesma exceção;
   - a mensagem deve ser genérica (`"E-mail ou senha inválidos"`). Assim ninguém descobre quais e-mails estão cadastrados;
   - se estiver certo, retorne `jwtService.gerarToken(email)`.

**Pergunta para pensar:** por que o `matches` compara o hash e não a senha em texto puro?

### Passo 3: Controller de login (backend)

**Objetivo:** expor o login pela API.

1. Crie `AuthController` com `@RequestMapping("/api/auth")`.
2. Crie `POST /login`, que recebe `LoginRequest` e devolve `{"token": "..."}`.
3. Em `SecurityConfig`, libere `/api/auth/**` com `permitAll()`.

**Como testar no Postman:**
- `POST /api/auth/login` com a senha certa: `200` e um token
- Com a senha errada: `401`
- Com um e-mail que não existe: `401` e a mesma mensagem

### Passo 4: Validar o token nas requisições (backend)

**Objetivo:** fazer o `JwtFilter` aceitar o token enviado pelo cliente.

Hoje o `JwtFilter` só chama `filterChain.doFilter`. Ele precisa:

1. Ler o cabeçalho `Authorization: Bearer <token>`.
2. Se existir, validar com `JwtService.validarEObterEmail(token)`.
3. Se for válido, criar um `UsernamePasswordAuthenticationToken` e colocá-lo no `SecurityContextHolder`.
4. Se não houver token ou ele for inválido, siga sem autenticar. O Spring bloqueia a rota depois.

> Atenção: se o token estiver expirado ou malformado, `validarEObterEmail` lança exceção. Capture-a e siga sem autenticar, em vez de deixar o erro subir.

### Passo 5: Fechar as rotas (backend)

**Objetivo:** só a criação de usuário e o login ficam públicos.

1. Em `SecurityConfig`, remova os `permitAll()` de `GET`, `PUT` e `DELETE` em `/api/usuarios` e de todos os métodos de `/api/projetos`.
2. Mantenha `POST /api/usuarios` e `/api/auth/**` públicos.

**Como testar no Postman:**
- `GET /api/projetos` sem token: `401` ou `403`
- Com `Authorization: Bearer <token>` (token do passo 3): `200`

> Faça este passo só depois do passo 4. Se fechar as rotas antes de o filtro funcionar, nem você consegue usar a API.

### Passo 6: Tela de login (frontend)

**Objetivo:** enviar e-mail e senha e guardar o token.

1. Em `Pages/Login/Login.tsx`, crie um formulário com e-mail e senha, no mesmo estilo do cadastro.
2. Ao enviar, faça `POST ${VITE_API_BASE_URL}/api/auth/login`.
3. Se der certo, guarde o token. Para começar, use `localStorage`.
4. Se der erro, mostre a mensagem do backend na tela.

### Passo 7: Contexto de autenticação (frontend)

**Objetivo:** deixar o token e as funções `login` e `logout` disponíveis para toda a aplicação.

1. Em `Context/AuthContext.tsx`, crie o `AuthProvider` com o estado `token`, e as funções `login(token)` e `logout()`.
2. Ao iniciar, leia o token do `localStorage`. Assim o usuário continua logado depois de recarregar a página.
3. Envolva o `App` com o `AuthProvider` em `main.tsx`.

### Passo 8: Logout

**Objetivo:** encerrar a sessão no cliente.

1. `logout()` apaga o token do estado e do `localStorage`.
2. Redirecione para `/login`.
3. No `Header`, mostre "Sair" quando houver token, e "Entrar" / "Criar conta" quando não houver.

> O logout não invalida o token no servidor. Quem copiou o token antes continua podendo usá-lo até a expiração. Revogar tokens antes disso exige guardar uma lista no servidor. Isso fica para depois.

### Passo 9: Rotas protegidas (frontend)

**Objetivo:** impedir que quem não está logado veja as páginas internas.

1. Crie `ProtectedRoute`, que verifica se há token no contexto.
2. Sem token, redirecione para `/login`. Com token, mostre a página.
3. Use nas rotas de Dashboard, Projetos, Tarefas e Cronograma.

## 4. Checklist de testes

Marque só depois de testar de verdade.

- [ ] Cadastro cria usuário com senha em hash, e a resposta não tem `senha`
- [ ] Login com senha certa retorna token (`200`)
- [ ] Login com senha errada retorna `401`
- [ ] `GET /api/projetos` sem token é bloqueado
- [ ] `GET /api/projetos` com token funciona
- [ ] Tela de login envia e guarda o token
- [ ] Recarregar a página mantém o usuário logado
- [ ] Logout apaga o token e leva para `/login`
- [ ] Rotas internas redirecionam para `/login` sem token

## 5. Usuários antigos

Usuários cadastrados antes do hash têm senha em texto puro e não conseguem fazer login. Apague-os no banco e cadastre de novo.
