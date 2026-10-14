# Autenticação: login e logout, passo a passo

Este guia mostra a ordem de construção do login e do logout. Cada etapa tem o que fazer e o porquê. Marque cada item antes de seguir para o próximo.

## Conceitos antes de começar

- **Hash da senha (BCrypt):** a senha nunca é guardada como foi digitada. Guardamos um resumo irreversível. No login, comparamos o resumo da senha digitada com o resumo salvo.
- **JWT:** um token assinado pelo servidor, que contém o e-mail do usuário e uma data de validade. O cliente guarda esse token e o envia em cada requisição.
- **Stateless:** o servidor não guarda sessão. Por isso o logout é feito pelo cliente, que descarta o token.

## Etapa 1: Cadastro (concluída)

- [x] `PasswordEncoder` (BCrypt) registrado em `SecurityConfig`.
- [x] `UsuarioService.criar` salva a senha com hash.
- [x] O campo `senha` tem `WRITE_ONLY` na entidade `Usuario`, então nunca volta nas respostas.
- [x] Tela `/cadastro` envia para `POST /api/usuarios`.

**Teste no Postman:** crie um usuário. A resposta não pode ter `senha`. No banco, a coluna `senha` deve começar com `$2a$`.

## Etapa 2: Endpoint de login (backend)

1. Crie o DTO `LoginRequest` com `email` e `senha`. Um DTO é o formato do dado que entra ou sai da API, separado da entidade.
2. Crie `AuthService.login(email, senha)`:
   - busque o usuário pelo e-mail com `UsuarioRepository.findByEmail`;
   - se não existir, ou se `passwordEncoder.matches(senha, usuario.getSenha())` for falso, lance erro. A mensagem deve ser genérica ("e-mail ou senha inválidos"), para não revelar qual campo está errado;
   - se estiver certo, gere o token com `JwtService.gerarToken(email)`.
3. Crie `AuthController` com `POST /api/auth/login`, que devolve `{"token": "..."}`.
4. Em `SecurityConfig`, libere `/api/auth/**` com `permitAll()`.

**Teste no Postman:**
- login com senha certa: `200` e um token;
- login com senha errada: `401`.

## Etapa 3: Proteger as rotas (backend)

1. Em `JwtFilter.doFilterInternal`:
   - leia o cabeçalho `Authorization: Bearer <token>`;
   - se existir, valide com `JwtService.validarEObterEmail(token)`;
   - se for válido, crie um `UsernamePasswordAuthenticationToken` e coloque no `SecurityContextHolder`;
   - se não houver token ou ele for inválido, apenas siga a cadeia. O Spring então bloqueia a rota.
2. Em `SecurityConfig`, remova os `permitAll()` de `/api/usuarios` e `/api/projetos`, deixando só o cadastro e o login públicos.

**Teste no Postman:**
- `GET /api/projetos` sem token: `401` ou `403`;
- com `Authorization: Bearer <token>`: `200`.

## Etapa 4: Tela de login (frontend)

1. Crie `Pages/Login/Login.tsx` com e-mail e senha, no mesmo estilo do cadastro.
2. Ao enviar, faça `POST /api/auth/login`.
3. Se der certo, guarde o token. Para começar, use `localStorage`. Depois de entender o fluxo, podemos discutir alternativas.
4. Se der erro, mostre a mensagem na tela.

## Etapa 5: Contexto de autenticação (frontend)

1. Crie `Context/AuthContext.tsx` com o token e as funções `login(token)` e `logout()`.
2. Ao iniciar a aplicação, leia o token do `localStorage` para manter o usuário logado após recarregar a página.
3. Envolva o `App` com o `AuthProvider` em `main.tsx`.

## Etapa 6: Logout

1. `logout()` remove o token do contexto e do `localStorage`.
2. Redirecione para `/login`.

**Atenção:** o JWT continua válido no servidor até expirar (24 horas no `JwtService`). Por isso o logout precisa apagar o token no cliente. Se quisermos invalidar um token antes da expiração, será preciso guardar uma lista de tokens revogados no servidor. Isso fica para depois.

## Etapa 7: Rotas protegidas (frontend)

1. Crie um componente `ProtectedRoute` que verifica se há token no contexto.
2. Se não houver, redirecione para `/login`. Se houver, mostre a página.
3. Use-o em Dashboard, Projetos, Tarefas e Cronograma.

## Checklist final

- [ ] Cadastro cria usuário com senha em hash e sem senha na resposta
- [ ] Login com senha certa retorna token
- [ ] Login com senha errada retorna 401
- [ ] Rota protegida sem token é bloqueada
- [ ] Rota protegida com token funciona
- [ ] Logout remove o token e leva para `/login`
- [ ] Depois de recarregar a página, o usuário continua logado

## Observação sobre usuários antigos

Usuários cadastrados antes desta mudança têm senha em texto puro. Eles não conseguem fazer login. Apague-os e cadastre de novo.
