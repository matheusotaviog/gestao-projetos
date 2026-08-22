import { createBrowserRouter, type RouteObject } from 'react-router'
import { AppShell } from '../components/layout/AppShell'
import { PlaceholderPage } from '../components/ui/PlaceholderPage'

export const routes: RouteObject[] = [
  {
    Component: AppShell,
    children: [
      {
        index: true,
        element: (
          <PlaceholderPage
            title="Dashboard"
            description="O progresso geral e as atividades do dia serão exibidos aqui."
          />
        ),
      },
      {
        path: 'projetos',
        element: (
          <PlaceholderPage
            title="Projetos"
            description="A criação e o gerenciamento de projetos serão implementados aqui."
          />
        ),
      },
      {
        path: 'projetos/:projetoId',
        element: (
          <PlaceholderPage
            title="Detalhes do projeto"
            description="As informações e tarefas do projeto selecionado serão exibidas aqui."
          />
        ),
      },
      {
        path: 'tarefas',
        element: (
          <PlaceholderPage
            title="Tarefas"
            description="A visualização consolidada das tarefas será definida com a equipe."
          />
        ),
      },
      {
        path: 'cronograma',
        element: (
          <PlaceholderPage
            title="Cronograma"
            description="Os compromissos e horários serão gerenciados aqui."
          />
        ),
      },
    ],
  },
  {
    path: '/login',
    element: (
      <PlaceholderPage
        title="Entrar"
        description="A autenticação será implementada em uma tarefa posterior."
      />
    ),
  },
  {
    path: '/cadastro',
    element: (
      <PlaceholderPage
        title="Criar conta"
        description="O cadastro será implementado em uma tarefa posterior."
      />
    ),
  },
  {
    path: '*',
    element: (
      <PlaceholderPage
        title="Página não encontrada"
        description="Verifique o endereço informado."
      />
    ),
  },
]

export const router = createBrowserRouter(routes)