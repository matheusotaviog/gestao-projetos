import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  createMemoryRouter,
  RouterProvider,
} from 'react-router'
import { describe, expect, it } from 'vitest'
import { routes } from './router'

function renderRouter(initialEntry = '/') {
  const router = createMemoryRouter(routes, {
    initialEntries: [initialEntry],
  })

  render(<RouterProvider router={router} />)
}

describe('roteamento da aplicação', () => {
  it('renderiza o layout e o dashboard na rota inicial', () => {
    renderRouter()

    expect(
      screen.getByRole('navigation', {
        name: 'Navegação principal',
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', {
        name: 'Dashboard',
      }),
    ).toBeInTheDocument()
  })

  it('navega para projetos e destaca o link ativo', async () => {
    const user = userEvent.setup()

    renderRouter()

    const projectsLink = screen.getByRole('link', {
      name: 'Projetos',
    })

    await user.click(projectsLink)

    expect(
      screen.getByRole('heading', {
        name: 'Projetos',
      }),
    ).toBeInTheDocument()

    expect(projectsLink).toHaveAttribute('aria-current', 'page')
  })

  it('exibe uma mensagem para uma rota inexistente', () => {
    renderRouter('/endereco-inexistente')

    expect(
      screen.getByRole('heading', {
        name: 'Página não encontrada',
      }),
    ).toBeInTheDocument()
  })

  it('renderiza a tela de login na rota /login', () => {
    renderRouter('/login')

    expect(
      screen.getByRole('heading', {
        name: 'Entrar',
      }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
    expect(screen.getByLabelText('Senha')).toBeInTheDocument()
  })

  it('renderiza a tela de cadastro na rota /cadastro', () => {
    renderRouter('/cadastro')

    expect(
      screen.getByRole('heading', {
        name: 'Criar conta',
      }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Nome completo')).toBeInTheDocument()
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
  })
})