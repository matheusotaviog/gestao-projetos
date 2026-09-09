import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { LoginForm } from '../components/LoginForm'
import { authService } from '../services/authService'

describe('LoginForm', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  function renderLoginForm(onSuccess?: () => void) {
    return render(
      <MemoryRouter>
        <LoginForm onSuccess={onSuccess} />
      </MemoryRouter>,
    )
  }

  it('renderiza os campos de e-mail, senha e botão de submissão', () => {
    renderLoginForm()

    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
    expect(screen.getByLabelText('Senha')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument()
  })

  it('exibe mensagens de validação quando submetido com campos vazios', async () => {
    const user = userEvent.setup()
    renderLoginForm()

    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(screen.getByText('O e-mail é obrigatório.')).toBeInTheDocument()
    expect(screen.getByText('A senha é obrigatória.')).toBeInTheDocument()
  })

  it('exibe erro para e-mail com formato inválido', async () => {
    const user = userEvent.setup()
    renderLoginForm()

    await user.type(screen.getByLabelText('E-mail'), 'emailinvalido')
    await user.type(screen.getByLabelText('Senha'), '123456')
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(
      screen.getByText('Informe um endereço de e-mail válido.'),
    ).toBeInTheDocument()
  })

  it('submete os dados com sucesso e executa onSuccess', async () => {
    const user = userEvent.setup()
    const onSuccess = vi.fn()
    vi.spyOn(authService, 'login').mockResolvedValueOnce({
      mensagem: 'Login realizado com sucesso!',
      token: 'fake-jwt-token',
    })

    renderLoginForm(onSuccess)

    await user.type(screen.getByLabelText('E-mail'), 'teste@exemplo.com')
    await user.type(screen.getByLabelText('Senha'), 'senha123')
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        email: 'teste@exemplo.com',
        senha: 'senha123',
      })
      expect(onSuccess).toHaveBeenCalledTimes(1)
    })
  })

  it('exibe mensagem de erro quando a autenticação falha', async () => {
    const user = userEvent.setup()
    vi.spyOn(authService, 'login').mockRejectedValueOnce(
      new Error('Credenciais inválidas.'),
    )

    renderLoginForm()

    await user.type(screen.getByLabelText('E-mail'), 'teste@exemplo.com')
    await user.type(screen.getByLabelText('Senha'), 'senhaerrada')
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Credenciais inválidas.')
    })
  })
})
