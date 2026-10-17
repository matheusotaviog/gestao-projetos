import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CadastroForm } from '../components/CadastroForm'
import { authService } from '../services/authService'

describe('CadastroForm', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  function renderCadastroForm(onSuccess?: () => void) {
    return render(
      <MemoryRouter>
        <CadastroForm onSuccess={onSuccess} />
      </MemoryRouter>,
    )
  }

  it('renderiza os campos de nome, e-mail, senha, confirmação e o botão', () => {
    renderCadastroForm()

    expect(screen.getByLabelText('Nome completo')).toBeInTheDocument()
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
    expect(screen.getByLabelText('Senha')).toBeInTheDocument()
    expect(screen.getByLabelText('Confirmar senha')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Criar conta' })).toBeInTheDocument()
  })

  it('exibe erros quando submetido com campos vazios', async () => {
    const user = userEvent.setup()
    renderCadastroForm()

    await user.click(screen.getByRole('button', { name: 'Criar conta' }))

    expect(screen.getByText('O nome é obrigatório.')).toBeInTheDocument()
    expect(screen.getByText('O e-mail é obrigatório.')).toBeInTheDocument()
    expect(screen.getByText('A senha é obrigatória.')).toBeInTheDocument()
    expect(
      screen.getByText('A confirmação de senha é obrigatória.'),
    ).toBeInTheDocument()
  })

  it('exibe erro quando as senhas não coincidem', async () => {
    const user = userEvent.setup()
    renderCadastroForm()

    await user.type(screen.getByLabelText('Nome completo'), 'Fulano de Tal')
    await user.type(screen.getByLabelText('E-mail'), 'fulano@exemplo.com')
    await user.type(screen.getByLabelText('Senha'), 'Senha@F0rte1')
    await user.type(screen.getByLabelText('Confirmar senha'), 'Senha@F0rte2')
    await user.click(screen.getByRole('button', { name: 'Criar conta' }))

    expect(
      screen.getByText('As senhas informadas não coincidem.'),
    ).toBeInTheDocument()
  })

  it('exibe erro quando a senha tem menos de 8 caracteres', async () => {
    const user = userEvent.setup()
    renderCadastroForm()

    await user.type(screen.getByLabelText('Nome completo'), 'Fulano de Tal')
    await user.type(screen.getByLabelText('E-mail'), 'fulano@exemplo.com')
    await user.type(screen.getByLabelText('Senha'), 'Ab1!xyz')
    await user.type(screen.getByLabelText('Confirmar senha'), 'Ab1!xyz')
    await user.click(screen.getByRole('button', { name: 'Criar conta' }))

    expect(
      screen.getByText('A senha deve ter pelo menos 8 caracteres.'),
    ).toBeInTheDocument()
  })

  it('exibe erro quando falta caractere especial na senha', async () => {
    const user = userEvent.setup()
    renderCadastroForm()

    await user.type(screen.getByLabelText('Nome completo'), 'Fulano de Tal')
    await user.type(screen.getByLabelText('E-mail'), 'fulano@exemplo.com')
    await user.type(screen.getByLabelText('Senha'), 'Senha1234')
    await user.type(screen.getByLabelText('Confirmar senha'), 'Senha1234')
    await user.click(screen.getByRole('button', { name: 'Criar conta' }))

    expect(
      screen.getByText(/A senha deve conter pelo menos um caractere especial/i),
    ).toBeInTheDocument()
  })

  it('exibe erro quando falta número na senha', async () => {
    const user = userEvent.setup()
    renderCadastroForm()

    await user.type(screen.getByLabelText('Nome completo'), 'Fulano de Tal')
    await user.type(screen.getByLabelText('E-mail'), 'fulano@exemplo.com')
    await user.type(screen.getByLabelText('Senha'), 'Senha@Forte')
    await user.type(screen.getByLabelText('Confirmar senha'), 'Senha@Forte')
    await user.click(screen.getByRole('button', { name: 'Criar conta' }))

    expect(
      screen.getByText('A senha deve conter pelo menos um número.'),
    ).toBeInTheDocument()
  })

  it('exibe erro quando falta letra maiúscula na senha', async () => {
    const user = userEvent.setup()
    renderCadastroForm()

    await user.type(screen.getByLabelText('Nome completo'), 'Fulano de Tal')
    await user.type(screen.getByLabelText('E-mail'), 'fulano@exemplo.com')
    await user.type(screen.getByLabelText('Senha'), 'senha@1234')
    await user.type(screen.getByLabelText('Confirmar senha'), 'senha@1234')
    await user.click(screen.getByRole('button', { name: 'Criar conta' }))

    expect(
      screen.getByText('A senha deve conter pelo menos uma letra maiúscula.'),
    ).toBeInTheDocument()
  })

  it('alterna a visibilidade dos campos de senha e confirmação', async () => {
    const user = userEvent.setup()
    renderCadastroForm()

    const senhaInput = screen.getByLabelText('Senha')
    const confirmarInput = screen.getByLabelText('Confirmar senha')

    expect(senhaInput).toHaveAttribute('type', 'password')
    expect(confirmarInput).toHaveAttribute('type', 'password')

    const toggleSenha = screen.getByRole('button', { name: 'Ver senha' })
    const toggleConfirmar = screen.getByRole('button', {
      name: 'Ver confirmar senha',
    })

    await user.click(toggleSenha)
    expect(senhaInput).toHaveAttribute('type', 'text')

    await user.click(toggleConfirmar)
    expect(confirmarInput).toHaveAttribute('type', 'text')
  })

  it('submete o formulário com sucesso quando todos os critérios são atendidos', async () => {
    const user = userEvent.setup()
    vi.spyOn(authService, 'cadastrar').mockResolvedValueOnce({
      id: 1,
      nome: 'Fulano de Tal',
      email: 'fulano@exemplo.com',
    })

    renderCadastroForm()

    await user.type(screen.getByLabelText('Nome completo'), 'Fulano de Tal')
    await user.type(screen.getByLabelText('E-mail'), 'fulano@exemplo.com')
    await user.type(screen.getByLabelText('Senha'), 'Senha@F0rte123')
    await user.type(screen.getByLabelText('Confirmar senha'), 'Senha@F0rte123')
    await user.click(screen.getByRole('button', { name: 'Criar conta' }))

    await waitFor(() => {
      expect(authService.cadastrar).toHaveBeenCalledWith({
        nome: 'Fulano de Tal',
        email: 'fulano@exemplo.com',
        senha: 'Senha@F0rte123',
      })
      expect(
        screen.getByText(/Conta criada com sucesso!/i),
      ).toBeInTheDocument()
    })
  })

  it('exibe mensagem de erro quando o cadastro falha no servidor', async () => {
    const user = userEvent.setup()
    vi.spyOn(authService, 'cadastrar').mockRejectedValueOnce(
      new Error('E-mail já cadastrado no sistema.'),
    )

    renderCadastroForm()

    await user.type(screen.getByLabelText('Nome completo'), 'Fulano de Tal')
    await user.type(screen.getByLabelText('E-mail'), 'fulano@exemplo.com')
    await user.type(screen.getByLabelText('Senha'), 'Senha@F0rte123')
    await user.type(screen.getByLabelText('Confirmar senha'), 'Senha@F0rte123')
    await user.click(screen.getByRole('button', { name: 'Criar conta' }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'E-mail já cadastrado no sistema.',
      )
    })
  })
})
