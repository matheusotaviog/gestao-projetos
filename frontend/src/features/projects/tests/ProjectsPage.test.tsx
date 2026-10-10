import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, it, expect, beforeEach } from 'vitest'
import { ProjectsPage } from '../pages/ProjectsPage'
import { projectService } from '../services/projectService'

function renderProjectsPage() {
  return render(
    <MemoryRouter>
      <ProjectsPage />
    </MemoryRouter>,
  )
}

describe('ProjectsPage (RF02)', () => {
  beforeEach(() => {
    projectService.resetMock()
  })

  it('renderiza os projetos iniciais e o cabeçalho', async () => {
    renderProjectsPage()

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Projetos e Matérias' }),
      ).toBeInTheDocument()
    })

    expect(
      screen.getByText('Algoritmos e Estruturas de Dados'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Banco de Dados Relacional'),
    ).toBeInTheDocument()

    // Verifica presença do botão de novo projeto
    expect(screen.getByRole('button', { name: '+ Novo Projeto' })).toBeInTheDocument()
  })

  it('permite criar um novo projeto através do modal (RF02)', async () => {
    const user = userEvent.setup()
    renderProjectsPage()

    await waitFor(() => {
      expect(screen.getByText('Algoritmos e Estruturas de Dados')).toBeInTheDocument()
    })

    // Clica no botão de novo projeto
    await user.click(screen.getByRole('button', { name: '+ Novo Projeto' }))

    // Modal deve ser exibido
    expect(screen.getByRole('dialog', { name: 'Novo Projeto' })).toBeInTheDocument()

    // Preenche o formulário
    const nomeInput = screen.getByLabelText(/Nome do Projeto/i)
    const descInput = screen.getByLabelText(/Descrição/i)

    await user.type(nomeInput, 'Inteligência Artificial')
    await user.type(descInput, 'Redes neurais e algoritmos genéticos')

    // Submete
    await user.click(screen.getByRole('button', { name: 'Salvar Projeto' }))

    // O novo projeto deve aparecer na listagem
    await waitFor(() => {
      expect(screen.getByText('Inteligência Artificial')).toBeInTheDocument()
      expect(screen.getByText('Redes neurais e algoritmos genéticos')).toBeInTheDocument()
    })
  })

  it('permite editar um projeto existente (RF02)', async () => {
    const user = userEvent.setup()
    renderProjectsPage()

    await waitFor(() => {
      expect(screen.getByText('Algoritmos e Estruturas de Dados')).toBeInTheDocument()
    })

    // Clica em Editar no primeiro projeto
    const editBtn = screen.getByLabelText('Editar projeto Algoritmos e Estruturas de Dados')
    await user.click(editBtn)

    // Modal deve abrir com título "Editar Projeto"
    expect(screen.getByRole('dialog', { name: 'Editar Projeto' })).toBeInTheDocument()

    const nomeInput = screen.getByLabelText(/Nome do Projeto/i)
    await user.clear(nomeInput)
    await user.type(nomeInput, 'Algoritmos e Teoria dos Grafos')

    await user.click(screen.getByRole('button', { name: 'Salvar Projeto' }))

    await waitFor(() => {
      expect(screen.getByText('Algoritmos e Teoria dos Grafos')).toBeInTheDocument()
    })
  })

  it('permite excluir um projeto com confirmação (RF02)', async () => {
    const user = userEvent.setup()
    renderProjectsPage()

    await waitFor(() => {
      expect(screen.getByText('Banco de Dados Relacional')).toBeInTheDocument()
    })

    // Clica em Excluir
    const deleteBtn = screen.getByLabelText('Excluir projeto Banco de Dados Relacional')
    await user.click(deleteBtn)

    // Modal de confirmação
    expect(screen.getByRole('dialog', { name: 'Excluir Projeto' })).toBeInTheDocument()
    expect(
      screen.getByText(/Todas as tarefas associadas a ele também serão permanentemente removidas/i),
    ).toBeInTheDocument()

    // Confirma
    await user.click(screen.getByRole('button', { name: 'Sim, excluir projeto' }))

    await waitFor(() => {
      expect(screen.queryByText('Banco de Dados Relacional')).not.toBeInTheDocument()
    })
  })

  it('filtra projetos através do campo de busca', async () => {
    const user = userEvent.setup()
    renderProjectsPage()

    await waitFor(() => {
      expect(screen.getByText('Algoritmos e Estruturas de Dados')).toBeInTheDocument()
      expect(screen.getByText('Banco de Dados Relacional')).toBeInTheDocument()
    })

    const searchInput = screen.getByLabelText('Buscar projetos')
    await user.type(searchInput, 'Algoritmos')

    expect(screen.getByText('Algoritmos e Estruturas de Dados')).toBeInTheDocument()
    expect(screen.queryByText('Banco de Dados Relacional')).not.toBeInTheDocument()
  })
})
