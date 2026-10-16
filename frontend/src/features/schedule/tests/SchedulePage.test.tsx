import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'
import { projectService } from '../../projects/services/projectService'
import { SchedulePage } from '../pages/SchedulePage'
import { scheduleService } from '../services/scheduleService'

function renderSchedulePage() {
  return render(
    <MemoryRouter>
      <SchedulePage />
    </MemoryRouter>,
  )
}

describe('SchedulePage', () => {
  beforeEach(() => {
    projectService.resetMock()
    scheduleService.resetMock()
  })

  it('renderiza os compromissos iniciais com o nome do projeto', async () => {
    renderSchedulePage()

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Cronograma' })).toBeInTheDocument()
      expect(screen.getByText('Algoritmos e Estruturas de Dados')).toBeInTheDocument()
    })

    expect(
      screen.getByText('Revisão de árvores binárias e exercícios práticos.'),
    ).toBeInTheDocument()
  })

  it('permite cadastrar um novo compromisso pelo modal', async () => {
    const user = userEvent.setup()
    renderSchedulePage()

    await waitFor(() => {
      expect(screen.getByText('Algoritmos e Estruturas de Dados')).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: '+ Novo Compromisso' }))

    expect(screen.getByRole('dialog', { name: 'Novo Compromisso' })).toBeInTheDocument()

    await user.type(screen.getByLabelText(/Data de Início/i), '2026-10-20')
    await user.type(screen.getByLabelText(/Horário de Início/i), '19:00')
    await user.type(screen.getByLabelText(/Horário de Fim/i), '21:00')
    await user.type(screen.getByLabelText(/Observações/i), 'Preparação para prova final')

    await user.click(screen.getByRole('button', { name: 'Salvar Compromisso' }))

    await waitFor(() => {
      expect(screen.getByText('Preparação para prova final')).toBeInTheDocument()
      expect(screen.getByText(/20\/10\/2026 • 19:00 - 21:00/)).toBeInTheDocument()
    })
  })

  it('exibe erro no modal quando horario final nao e posterior ao inicial', async () => {
    const user = userEvent.setup()
    renderSchedulePage()

    await waitFor(() => {
      expect(screen.getByText('Algoritmos e Estruturas de Dados')).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: '+ Novo Compromisso' }))

    await user.type(screen.getByLabelText(/Data de Início/i), '2026-10-20')
    await user.type(screen.getByLabelText(/Horário de Início/i), '20:00')
    await user.type(screen.getByLabelText(/Horário de Fim/i), '19:00')

    await user.click(screen.getByRole('button', { name: 'Salvar Compromisso' }))

    expect(
      screen.getByText('O horário de fim deve ser posterior ao horário de início.'),
    ).toBeInTheDocument()
  })
})
