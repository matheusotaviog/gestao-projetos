# Gestão de Projetos e Cronogramas — Esboço do Projeto

**Curso:** Desenvolvimento Fullstack — Nível Básico ao Júnior

## 1. Visão Geral

Sistema web voltado à organização de projetos do usuário, permitindo criar cronogramas, cadastrar atividades e tarefas, definir metas e acompanhar o progresso de forma simples e visual. A plataforma possui estrutura flexível, permitindo adaptar nomenclaturas para suportar diferentes tipos de gestão.

Ajudar o usuário a planejar e acompanhar sua rotina de trabalho de maneira prática, centralizando conteúdos, prazos e progresso em um único lugar.

## 2. Escopo (MVP)

- Cadastro de atividades e projetos
- Criação de cronograma (dias e horários de trabalho)
- Marcação de tarefas/tópicos como concluídos
- Visualização de progresso (percentual concluído)

## 3. Requisitos Funcionais (RF)

| Nº | Descrição |
|------|-----------|
| RF01 | O sistema deve permitir cadastro e login de usuário |
| RF02 | O usuário deve poder criar, editar e excluir projetos |
| RF03 | O usuário deve poder criar um cronograma de atividades (dia, horário, projeto) |
| RF04 | O usuário deve poder cadastrar tarefas dentro de cada projeto |
| RF05 | O usuário deve poder marcar tópicos como "concluído" ou "pendente" |
| RF06 | O sistema deve exibir um painel com o progresso geral (%) |
| RF07 | O usuário deve poder editar e excluir itens do cronograma |
| RF08 | O sistema deve exibir lembretes das atividades programadas para o dia |

## 4. Requisitos Não Funcionais (RNF)

| Nº | Descrição |
|------|-----------|
| RNF01 | O sistema deve ser responsivo (funcionar em desktop e mobile) |
| RNF02 | O tempo de resposta das ações deve ser inferior a 2 segundos |
| RNF03 | Os dados devem ser persistidos em banco de dados relacional |
| RNF04 | O sistema deve garantir autenticação segura (senha criptografada) |
| RNF05 | A interface deve seguir um padrão visual consistente (design system simples) |
| RNF06 | O código deve seguir boas práticas, organizado em camadas (front-end, back-end e banco de dados) |

## 5. Stack Sugerida

| Camada | Tecnologia |
|--------|-----------|
| Front-end | HTML, CSS, JavaScript (ou React) |
| Back-end | Java/Spring |
| Banco de Dados | MySQL ou PostgreSQL |
| Autenticação | JWT (JSON Web Token) |

## 6. Direcionamentos Futuros

- Integração de chatbot com IA para suporte a dúvidas e apoio técnico
- Implementação de sistema de alertas e notificações para prazos de entrega e status de progresso

---
*Documento preparado para apresentação de esboço de projeto em reunião de curso.*