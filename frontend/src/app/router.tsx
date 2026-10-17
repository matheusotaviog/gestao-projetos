import { createBrowserRouter, type RouteObject } from 'react-router'
import { AppShell } from '../components/layout/AppShell'
import { PlaceholderPage } from '../components/ui/PlaceholderPage'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { CadastroPage } from '../features/auth/pages/CadastroPage'
import { ProjectsPage } from '../features/projects/pages/ProjectsPage'
import { ProjectDetailsPage } from '../features/projects/pages/ProjectDetailsPage'
import { SchedulePage } from '../features/schedule/pages/SchedulePage'

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
        element: <ProjectsPage />,
      },
      {
        path: 'projetos/:projetoId',
        element: <ProjectDetailsPage />,
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
        element: <SchedulePage />,
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/cadastro',
    element: <CadastroPage />,
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