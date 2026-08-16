# Guia de Onboarding

Este documento é o ponto de partida para quem está entrando no projeto. Aqui você encontra como baixar o projeto e como funciona o nosso fluxo de trabalho no dia a dia.

## 1. Como baixar o projeto

Clone o repositório na sua máquina:

```bash
git clone https://github.com/matheusotaviog/gestao-projetos.git
```

Depois de clonado, você vai encontrar a seguinte estrutura principal:

```
gestao-projetos/
├── backend/
├── frontend/
├── devops/
├── docs/
└── README.md
```

## 2. Como executar o projeto

As instruções específicas de como rodar cada parte do sistema (dependências, variáveis de ambiente, comandos, etc.) ficam nos seguintes lugares:

- **README.md** (raiz do projeto) — visão geral e apresentação do projeto
- **backend/README.md** — como rodar o backend
- **frontend/README.md** — como rodar o frontend

> Esses READMEs ainda estão em construção e serão atualizados conforme o projeto avança. Sempre confira lá antes de tentar rodar algo, pois as instruções vão evoluir com o tempo.

## 3. Como trabalhamos (fluxo de branch e Pull Request)

A branch `main` é a **fonte da verdade** do projeto — ela deve sempre representar uma versão funcional e estável do sistema, sem erros ou problemas conhecidos. Por isso, ninguém commita diretamente nela. Todo o trabalho segue este fluxo:

1. **Criar uma branch separada** para a tarefa que você vai desenvolver (nunca trabalhe direto na `main`)
2. **Desenvolver e commitar** o seu código nessa branch
3. Quando a tarefa estiver pronta, **abrir um Pull Request (PR)** pedindo para juntar (merge) sua branch com a `main`
4. **Pelo menos um colega da equipe precisa revisar e aprovar** o seu PR antes que ele possa ser mergeado
5. Após a aprovação, o PR é mergeado na `main`

Isso garante que todo código que entra na `main` já passou pelo olhar de outra pessoa da equipe — ajuda a pegar erros, sugerir melhorias e manter todo mundo alinhado com o que está sendo construído.

> Se tiver dúvida sobre os termos usados aqui (branch, Pull Request, etc.), dá uma olhada no [Glossário de Conceitos](./02-glossario-conceitos.md).

## 4. Por que documentamos em `.md` (Markdown) e não em `.pdf`

Toda a documentação do projeto (como este guia, o glossário e o esboço) é escrita em Markdown (`.md`), e não em PDF. Isso não é acaso — é o padrão usado em repositórios de código:

- É o mesmo formato do `README.md`, que o próprio GitHub reconhece e exibe automaticamente na página do repositório
- O GitHub renderiza o `.md` já formatado (títulos, listas, tabelas), sem precisar baixar nada
- Por ser texto puro, o Git consegue mostrar exatamente o que mudou entre uma versão e outra — algo que não é possível com um PDF
- Qualquer pessoa da equipe consegue editar direto pelo navegador, sem precisar de outro programa

Ou seja: `.md` é o formato ideal para documentação viva, que vamos consultar e atualizar com frequência ao longo do projeto.

---

> Este guia também vai evoluir com o tempo — se algo não estiver claro ou faltar alguma informação, é só sinalizar para o time.