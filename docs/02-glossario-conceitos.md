# Glossário de Conceitos do Projeto

Este documento explica, de forma simples, os principais termos e conceitos usados na documentação e no dia a dia do projeto. O objetivo é que qualquer pessoa da equipe consiga entender o vocabulário usado.

## Requisitos Funcionais (RF)

São as **funcionalidades** que o sistema precisa ter — ou seja, "o que o sistema faz". Descrevem ações concretas que o usuário consegue realizar ou que o sistema executa.

**Exemplo do nosso projeto:**
> RF02 — O usuário deve poder criar, editar e excluir projetos.

Isso é um requisito funcional porque descreve uma ação/funcionalidade específica que existirá no sistema.

**Pergunta que ajuda a identificar um RF:** *"O que o usuário consegue fazer no sistema?"*

## Requisitos Não Funcionais (RNF)

São as **qualidades e características** que o sistema precisa ter, mas que não são uma funcionalidade em si. Descrevem *como* o sistema deve se comportar, não *o que* ele faz.

**Exemplo do nosso projeto:**
> RNF02 — O tempo de resposta das ações deve ser inferior a 2 segundos.

Isso é um requisito não funcional porque não é uma função que o usuário aciona — é uma característica de qualidade (desempenho) que o sistema precisa atender.

**Pergunta que ajuda a identificar um RNF:** *"Como o sistema deve se comportar (rapidez, segurança, usabilidade, etc.)?"*

**Categorias comuns de RNF:**
- **Performance** — tempo de resposta, velocidade
- **Segurança** — criptografia, autenticação
- **Usabilidade** — facilidade de uso, design consistente
- **Compatibilidade** — funcionar em diferentes dispositivos/navegadores
- **Manutenibilidade** — código organizado, fácil de dar manutenção

## MVP (Minimum Viable Product / Produto Mínimo Viável)

É a **versão mais simples e enxuta possível do sistema**, contendo apenas as funcionalidades essenciais para que ele já seja útil e utilizável. A ideia do MVP não é ser incompleto ou malfeito, mas sim ser o menor conjunto de funcionalidades que já entrega valor real ao usuário.

**Por que isso importa?**
- Evita perder tempo construindo funcionalidades que talvez nem sejam necessárias
- Permite validar se a ideia funciona antes de investir em recursos extras
- Dá um objetivo claro e alcançável para a primeira entrega

**No nosso projeto**, o MVP está definido na seção "Escopo (MVP)" do [esboço do projeto](./01-esboco-projeto.md): cadastro de atividades/projetos, criação de cronograma, marcação de tarefas como concluídas e visualização de progresso. Tudo que estiver fora dessa lista (como o chatbot com IA, por exemplo) é considerado um **direcionamento futuro** — ou seja, algo para depois do MVP estar pronto.

## Outros termos úteis

**API (Application Programming Interface)**
Uma "porta de entrada" que permite que dois sistemas conversem entre si. No nosso projeto, o frontend vai se comunicar com o backend através de uma API.

**API REST**
Um padrão (estilo) de construção de APIs, muito usado no mercado. Define regras de como o frontend pede e recebe dados do backend (ex: buscar uma lista de tarefas, criar um novo projeto, etc.), geralmente usando o protocolo HTTP.

**Backend**
A parte do sistema que roda "por trás das cenas" — não é visível ao usuário. Responsável pelas regras de negócio, acesso ao banco de dados e processamento de informações. No nosso projeto, é feito em **Java + Spring**.

**Frontend**
A parte do sistema com a qual o usuário interage diretamente — telas, botões, formulários. No nosso projeto, é feito em **React**.

**JWT (JSON Web Token)**
Uma forma de gerar um "token" (uma espécie de crachá digital) que comprova que o usuário está autenticado, sem precisar que o servidor guarde essa informação em memória. É bastante usado para autenticação em APIs REST.

**Autenticação vs. Autorização**
- **Autenticação**: confirmar *quem* é o usuário (ex: login com e-mail e senha)
- **Autorização**: definir *o que* esse usuário tem permissão de fazer depois de autenticado

**Issue**
Um "ticket" ou "chamado" para representar uma tarefa, bug ou melhoria a ser feita no projeto. Ainda não definimos se vamos usar o GitHub Projects ou o Notion para gerenciar isso — assim que decidirmos, atualizamos aqui.

**Pull Request (PR)**
Uma solicitação para que o código de uma branch (ramo separado) seja revisado e, se aprovado, incorporado (merge) à branch principal (`main`). É o fluxo de trabalho que já configuramos no repositório.

**Branch**
Uma "ramificação" do código — permite trabalhar em uma funcionalidade separadamente, sem afetar o código principal, até que esteja pronta para ser revisada e integrada.

---

> Este documento pode (e deve) crescer conforme novos termos surgirem ao longo do projeto. Se algum conceito não estiver claro, é só perguntar para o time ou adicionar aqui.