# Autenticação: o que falta

1. **Endpoint de login:** o DTO, o `AuthService` e o `AuthController` não existem. Hoje não há `POST /api/auth/login`.
2. **Validação do token:** o `JwtFilter` só repassa a requisição, então um token enviado não é verificado.
3. **Rotas fechadas:** `GET /api/projetos` continua aberta sem token.
4. **Tela de login:** `Login.tsx` é um placeholder com `<p>...</p>`.
5. **Contexto:** `AuthContext.tsx` está vazio.
6. **Logout e rotas protegidas:** o Header não tem botão de sair e nenhuma página é protegida.

## Cadastro: estado atual

**Implementado nas duas camadas:**
- **Backend:** `POST /api/usuarios` verifica se o e-mail já existe, salva a senha com BCrypt e não devolve a senha na resposta. A rota é pública e o CORS libera `http://localhost:5173`.
- **Frontend:** `Pages/Cadastro/Cadastro.tsx` valida os campos, envia para a API e mostra o erro que o backend devolver.

**Ainda impede o uso:**
- **Banco recusa a senha:** a senha em `backend/.env` é recusada pelo PostgreSQL com `password authentication failed for user "admin"`. Sem isso o backend não sobe.
- **Falta `frontend/.env`:** o formulário usa `VITE_API_BASE_URL`. Sem o arquivo, a chamada vai para `undefined/api/usuarios`. Copie o `.env.example` do frontend para `.env`.
- **Não testado de ponta a ponta:** ainda não foi criado nenhum usuário pela tela.
- **Não está na `main`:** o código está nos branches `feature/cadastro` e `feature/autenticacao`, sem PR aberto.
