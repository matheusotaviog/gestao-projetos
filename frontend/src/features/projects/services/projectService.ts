import type { Projeto, ProjetoComTarefas, ProjetoInput } from '../types'
import type { Tarefa } from '../../tasks/types'
import { taskService } from '../../tasks/services/taskService'
import { authService } from '../../auth/services/authService'

const PROJECTS_STORAGE_KEY = 'gestao_projetos_projetos'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

const INITIAL_PROJECTS: Projeto[] = [
  {
    id: 1,
    nome: 'Algoritmos e Estruturas de Dados',
    descricao: 'Estudos de complexidade assintótica, árvores binárias e ordenação.',
    data_criacao: '2026-08-15T10:00:00.000Z',
  },
  {
    id: 2,
    nome: 'Banco de Dados Relacional',
    descricao: 'Modelagem relacional, normalização até 3FN e consultas SQL.',
    data_criacao: '2026-08-18T09:00:00.000Z',
  },
]

function getStoredProjects(): Projeto[] {
  try {
    const raw = localStorage.getItem(PROJECTS_STORAGE_KEY)
    if (!raw) {
      const clones = INITIAL_PROJECTS.map((p) => ({ ...p }))
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(clones))
      return clones
    }
    return JSON.parse(raw) as Projeto[]
  } catch {
    return INITIAL_PROJECTS.map((p) => ({ ...p }))
  }
}

function saveStoredProjects(projetos: Projeto[]): void {
  try {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projetos))
  } catch {
    // Silently continue if localStorage quota exceeded
  }
}

function getAuthHeaders(): HeadersInit {
  const token = authService.getToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export const projectService = {
  async listar(): Promise<ProjetoComTarefas[]> {
    let projetos: Projeto[] = []

    if (API_BASE_URL) {
      try {
        const response = await fetch(`${API_BASE_URL}/projetos`, {
          headers: getAuthHeaders(),
        })
        if (response.ok) {
          projetos = (await response.json()) as Projeto[]
        }
      } catch {
        // Fallback para armazenamento local
      }
    }

    if (projetos.length === 0) {
      projetos = getStoredProjects()
    }

    const todasTarefas = await taskService.listarTodas()

    return projetos.map((projeto) => {
      const tarefasDoProjeto = todasTarefas.filter((t) => t.projeto_id === projeto.id)
      return {
        ...projeto,
        totalTarefas: tarefasDoProjeto.length,
      }
    })
  },

  async buscarPorId(id: number): Promise<ProjetoComTarefas | null> {
    const todos = await this.listar()
    return todos.find((p) => p.id === id) ?? null
  },

  async criar(dados: ProjetoInput): Promise<ProjetoComTarefas> {
    if (!dados.nome.trim()) {
      throw new Error('O nome do projeto é obrigatório.')
    }

    if (dados.nome.trim().length < 2) {
      throw new Error('O nome do projeto deve ter pelo menos 2 caracteres.')
    }

    if (API_BASE_URL) {
      try {
        const response = await fetch(`${API_BASE_URL}/projetos`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            nome: dados.nome.trim(),
            descricao: dados.descricao?.trim() || null,
          }),
        })
        if (response.ok) {
          const criado = (await response.json()) as Projeto
          return {
            ...criado,
            totalTarefas: 0,
          }
        }
      } catch {
        // Fallback para armazenamento local
      }
    }

    const projetos = getStoredProjects()
    const nextId = projetos.length > 0 ? Math.max(...projetos.map((p) => p.id)) + 1 : 1
    const novoProjeto: Projeto = {
      id: nextId,
      nome: dados.nome.trim(),
      descricao: dados.descricao?.trim() || null,
      data_criacao: new Date().toISOString(),
    }

    projetos.push(novoProjeto)
    saveStoredProjects(projetos)

    return {
      ...novoProjeto,
      totalTarefas: 0,
    }
  },

  async atualizar(id: number, dados: ProjetoInput): Promise<ProjetoComTarefas> {
    if (!dados.nome.trim()) {
      throw new Error('O nome do projeto é obrigatório.')
    }

    if (dados.nome.trim().length < 2) {
      throw new Error('O nome do projeto deve ter pelo menos 2 caracteres.')
    }

    if (API_BASE_URL) {
      try {
        const response = await fetch(`${API_BASE_URL}/projetos/${id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            nome: dados.nome.trim(),
            descricao: dados.descricao?.trim() || null,
          }),
        })
        if (response.ok) {
          const atualizado = (await response.json()) as Projeto
          const tarefas = await taskService.listarPorProjeto(id)
          return {
            ...atualizado,
            totalTarefas: tarefas.length,
          }
        }
      } catch {
        // Fallback para armazenamento local
      }
    }

    const projetos = getStoredProjects()
    const index = projetos.findIndex((p) => p.id === id)
    if (index === -1) {
      throw new Error('Projeto não encontrado.')
    }

    const projetoAtualizado: Projeto = {
      ...projetos[index],
      nome: dados.nome.trim(),
      descricao: dados.descricao?.trim() || null,
    }

    projetos[index] = projetoAtualizado
    saveStoredProjects(projetos)

    const tarefas = await taskService.listarPorProjeto(id)

    return {
      ...projetoAtualizado,
      totalTarefas: tarefas.length,
    }
  },

  async excluir(id: number): Promise<void> {
    if (API_BASE_URL) {
      try {
        const response = await fetch(`${API_BASE_URL}/projetos/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
        })
        if (response.ok) {
          await taskService.excluirPorProjeto(id)
          return
        }
      } catch {
        // Fallback para armazenamento local
      }
    }

    const projetos = getStoredProjects()
    const filtrados = projetos.filter((p) => p.id !== id)
    saveStoredProjects(filtrados)

    // Remove tarefas associadas ao projeto (efeito ON DELETE CASCADE)
    await taskService.excluirPorProjeto(id)
  },

  async restaurar(projeto: Projeto, tarefas?: Tarefa[]): Promise<ProjetoComTarefas> {
    const projetos = getStoredProjects()
    if (!projetos.some((p) => p.id === projeto.id)) {
      projetos.push(projeto)
      projetos.sort((a, b) => a.id - b.id)
      saveStoredProjects(projetos)
    }

    if (tarefas && tarefas.length > 0) {
      await taskService.restaurarMuitas(tarefas)
    }

    const tarefasDoProjeto = await taskService.listarPorProjeto(projeto.id)
    return {
      ...projeto,
      totalTarefas: tarefasDoProjeto.length,
    }
  },

  resetMock(): void {
    localStorage.removeItem(PROJECTS_STORAGE_KEY)
    taskService.resetMock()
  },
}
