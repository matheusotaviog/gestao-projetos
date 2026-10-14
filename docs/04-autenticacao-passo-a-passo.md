# Autenticação: o que falta

1. **Endpoint de login:** o DTO, o `AuthService` e o `AuthController` não existem. Hoje não há `POST /api/auth/login`.
2. **Validação do token:** o `JwtFilter` só repassa a requisição, então um token enviado não é verificado.
3. **Rotas fechadas:** `GET /api/projetos` continua aberta sem token.
4. **Tela de login:** `Login.tsx` é um placeholder com `<p>...</p>`.
5. **Contexto:** `AuthContext.tsx` está vazio.
6. **Logout e rotas protegidas:** o Header não tem botão de sair e nenhuma página é protegida.
