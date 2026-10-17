import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Toast } from './Toast'

describe('Toast', () => {
  it('renderiza mensagem e botão de fechar', async () => {
    const handleClose = vi.fn()
    render(<Toast message="Item salvo com sucesso" onClose={handleClose} />)

    expect(screen.getByText('Item salvo com sucesso')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Fechar notificação' })).toBeInTheDocument()
  })

  it('chama onAction e onClose ao clicar no botão de ação', async () => {
    const user = userEvent.setup()
    const handleClose = vi.fn()
    const handleAction = vi.fn()

    render(
      <Toast
        message="Projeto excluído com sucesso."
        actionLabel="Desfazer"
        onAction={handleAction}
        onClose={handleClose}
      />,
    )

    const actionBtn = screen.getByRole('button', { name: 'Desfazer' })
    expect(actionBtn).toBeInTheDocument()

    await user.click(actionBtn)

    expect(handleAction).toHaveBeenCalledTimes(1)
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('fecha automaticamente após o tempo limite', () => {
    vi.useFakeTimers()
    const handleClose = vi.fn()

    render(<Toast message="Teste" onClose={handleClose} duration={3000} />)

    expect(handleClose).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(3000)
    })

    expect(handleClose).toHaveBeenCalledTimes(1)
    vi.useRealTimers()
  })
})
