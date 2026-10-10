import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router'
import { describe, it, expect, beforeEach } from 'vitest'
import { ProjectDetailsPage } from '../pages/ProjectDetailsPage'
import { projectService } from '../services/projectService'
import { taskService } from '../../tasks/services/taskService'

function renderProjectDetails(projetoId = '1') {
  return render(
    <MemoryRouter initialEntries={[`/projetos/${projetoId}`]}>
      <Routes>
        <Route path="/projetos/:projetoId" element={<ProjectDetailsPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ProjectDetailsPage (RF02, RF04)', () => {
  beforeEach(() => {
    projectService.resetMock()
    taskService.resetMock()
  })

  it('renderiza os dados do projeto e a lista de suas tarefas (RF04)', async () => {
    renderProjectDetails('1')

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Algoritmos e Estruturas de Dados' }),
      ).toBeInTheDocument()
    })

    // Deve exibir tarefas do projeto 1
    expect(screen.getByText('Implementar busca binária em TypeScript')).toBeInTheDocument()
    expect(screen.getByText('Resolver lista de exercícios sobre Árvores AVL')).toBeInTheDocument()

    // Não deve exibir tarefas do projeto 2
    expect(screen.queryByText('Elaborar diagrama Entidade-Relacionamento')).not.toBeInTheDocument()

    // Mostra quantidade de tarefas cadastradas
    expect(screen.getByText(/2 tarefas cadastradas/i)).toBeInTheDocument()
  })

  it('permite cadastrar uma nova tarefa no projeto (RF04)', async () => {
    const user = userEvent.setup()
    renderProjectDetails('1')

    await waitFor(() => {
      expect(screen.getByText('Implementar busca binária em TypeScript')).toBeInTheDocument()
    })

    // Abre modal de nova tarefa
    await user.click(screen.getByRole('button', { name: '+ Nova Tarefa' }))

    expect(screen.getByRole('dialog', { name: 'Nova Tarefa' })).toBeInTheDocument()

    // Preenche dados da tarefa
    const tituloInput = screen.getByLabelText(/Título da Tarefa/i)
    await user.type(tituloInput, 'Estudar Ordenação Quicksort')

    // Salva
    await user.click(screen.getByRole('button', { name: 'Salvar Tarefa' }))

    // A tarefa deve aparecer na lista
    await waitFor(() => {
      expect(screen.getByText('Estudar Ordenação Quicksort')).toBeInTheDocument()
    })
  })

  it('permite alternar status da tarefa entre pendente e concluído', async () => {
    const user = userEvent.setup()
    renderProjectDetails('1')

    await waitFor(() => {
      expect(screen.getByText('Resolver lista de exercícios sobre Árvores AVL')).toBeInTheDocument()
    })

    // Tarefa 2 está pendente inicialmente. Vamos clicar no checkbox para marcar como concluída
    const toggleButton = screen.getByLabelText(
      'Marcar "Resolver lista de exercícios sobre Árvores AVL" como concluída',
    )
    await user.click(toggleButton)

    await waitFor(() => {
      expect(
        screen.getByLabelText(
          'Marcar "Resolver lista de exercícios sobre Árvores AVL" como pendente',
        ),
      ).toBeInTheDocument()
    })
  })

  it('permite editar os dados de uma tarefa existente', async () => {
    const user = userEvent.setup()
    renderProjectDetails('1')

    await waitFor(() => {
      expect(screen.getByText('Implementar busca binária em TypeScript')).toBeInTheDocument()
    })

    const editBtn = screen.getByLabelText('Editar tarefa Implementar busca binária em TypeScript')
    await user.click(editBtn)

    expect(screen.getByRole('dialog', { name: 'Editar Tarefa' })).toBeInTheDocument()

    const tituloInput = screen.getByLabelText(/Título da Tarefa/i)
    await user.clear(tituloInput)
    await user.type(tituloInput, 'Implementar busca binária e ternária')

    await user.click(screen.getByRole('button', { name: 'Salvar Tarefa' }))

    await waitFor(() => {
      expect(screen.getByText('Implementar busca binária e ternária')).toBeInTheDocument()
    })
  })

  it('permite excluir uma tarefa com confirmação', async () => {
    const user = userEvent.setup()
    renderProjectDetails('1')

    await waitFor(() => {
      expect(screen.getByText('Implementar busca binária em TypeScript')).toBeInTheDocument()
    })

    const deleteBtn = screen.getByLabelText('Excluir tarefa Implementar busca binária em TypeScript')
    await user.click(deleteBtn)

    expect(screen.getByRole('dialog', { name: 'Excluir Tarefa' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Sim, excluir tarefa' }))

    await waitFor(() => {
      expect(screen.queryByText('Implementar busca binária em TypeScript')).not.toBeInTheDocument()
    })
  })
})
