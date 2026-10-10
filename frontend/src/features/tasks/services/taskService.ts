import type { Tarefa, TarefaInput, TarefaStatus } from '../types'
import { authService } from '../../auth/services/authService'

const TASKS_STORAGE_KEY = 'gestao_projetos_tarefas'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

const INITIAL_TASKS: Tarefa[] = [
  {
    id: 1,
    projeto_id: 1,
    titulo: 'Implementar busca binária em TypeScript',
    status: 'concluido',
    data_entrega: '2026-08-20',
    observacao: 'Complexidade O(log n) com verificação de limites.',
    data_criacao: '2026-08-15T10:30:00.000Z',
  },
  {
    id: 2,
    projeto_id: 1,
    titulo: 'Resolver lista de exercícios sobre Árvores AVL',
    status: 'pendente',
    data_entrega: '2026-09-15',
    observacao: 'Capítulo 4 do livro de Sedgewick.',
    data_criacao: '2026-08-16T14:00:00.000Z',
  },
  {
    id: 3,
    projeto_id: 2,
    titulo: 'Elaborar diagrama Entidade-Relacionamento',
    status: 'concluido',
    data_entrega: '2026-08-25',
    observacao: 'Revisar cardinalidades 1:N e N:N entre tabelas.',
    data_criacao: '2026-08-18T09:30:00.000Z',
  },
  {
    id: 4,
    projeto_id: 2,
    titulo: 'Escrever scripts DDL das tabelas principais',
    status: 'pendente',
    data_entrega: '2026-09-20',
    observacao: 'Garantir chaves estrangeiras com ON DELETE CASCADE.',
    data_criacao: '2026-08-19T11:00:00.000Z',
  },
]

function getStoredTasks(): Tarefa[] {
  try {
    const raw = localStorage.getItem(TASKS_STORAGE_KEY)
    if (!raw) {
      const clones = INITIAL_TASKS.map((t) => ({ ...t }))
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(clones))
      return clones
    }
    return JSON.parse(raw) as Tarefa[]
  } catch {
    return INITIAL_TASKS.map((t) => ({ ...t }))
  }
}

function saveStoredTasks(tarefas: Tarefa[]): void {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tarefas))
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

export const taskService = {
  async listarTodas(): Promise<Tarefa[]> {
    if (API_BASE_URL) {
      try {
        const response = await fetch(`${API_BASE_URL}/tarefas`, {
          headers: getAuthHeaders(),
        })
        if (response.ok) {
          return (await response.json()) as Tarefa[]
        }
      } catch {
        // Fallback para armazenamento local
      }
    }
    return getStoredTasks()
  },

  async listarPorProjeto(projetoId: number): Promise<Tarefa[]> {
    if (API_BASE_URL) {
      try {
        const response = await fetch(`${API_BASE_URL}/projetos/${projetoId}/tarefas`, {
          headers: getAuthHeaders(),
        })
        if (response.ok) {
          return (await response.json()) as Tarefa[]
        }
      } catch {
        // Fallback para armazenamento local
      }
    }
    const all = getStoredTasks()
    return all.filter((t) => t.projeto_id === projetoId)
  },

  async criar(projetoId: number, dados: TarefaInput): Promise<Tarefa> {
    if (!dados.titulo.trim()) {
      throw new Error('O título da tarefa é obrigatório.')
    }

    if (API_BASE_URL) {
      try {
        const response = await fetch(`${API_BASE_URL}/projetos/${projetoId}/tarefas`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            projeto_id: projetoId,
            titulo: dados.titulo.trim(),
            status: dados.status ?? 'pendente',
            data_entrega: dados.data_entrega || null,
            observacao: dados.observacao?.trim() || null,
          }),
        })
        if (response.ok) {
          return (await response.json()) as Tarefa
        }
      } catch {
        // Fallback para armazenamento local
      }
    }

    const tasks = getStoredTasks()
    const nextId = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1
    const novaTarefa: Tarefa = {
      id: nextId,
      projeto_id: projetoId,
      titulo: dados.titulo.trim(),
      status: dados.status ?? 'pendente',
      data_entrega: dados.data_entrega || null,
      observacao: dados.observacao?.trim() || null,
      data_criacao: new Date().toISOString(),
    }

    tasks.push(novaTarefa)
    saveStoredTasks(tasks)
    return novaTarefa
  },

  async atualizar(id: number, dados: Partial<TarefaInput>): Promise<Tarefa> {
    if (dados.titulo !== undefined && !dados.titulo.trim()) {
      throw new Error('O título da tarefa não pode ficar vazio.')
    }

    if (API_BASE_URL) {
      try {
        const response = await fetch(`${API_BASE_URL}/tarefas/${id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(dados),
        })
        if (response.ok) {
          return (await response.json()) as Tarefa
        }
      } catch {
        // Fallback para armazenamento local
      }
    }

    const tasks = getStoredTasks()
    const index = tasks.findIndex((t) => t.id === id)
    if (index === -1) {
      throw new Error('Tarefa não encontrada.')
    }

    const tarefaAtual = tasks[index]
    const tarefaAtualizada: Tarefa = {
      ...tarefaAtual,
      ...(dados.titulo !== undefined ? { titulo: dados.titulo.trim() } : {}),
      ...(dados.status !== undefined ? { status: dados.status } : {}),
      ...(dados.data_entrega !== undefined ? { data_entrega: dados.data_entrega || null } : {}),
      ...(dados.observacao !== undefined ? { observacao: dados.observacao?.trim() || null } : {}),
    }

    tasks[index] = tarefaAtualizada
    saveStoredTasks(tasks)
    return tarefaAtualizada
  },

  async alternarStatus(id: number): Promise<Tarefa> {
    const tasks = getStoredTasks()
    const task = tasks.find((t) => t.id === id)
    const novoStatus: TarefaStatus = task?.status === 'concluido' ? 'pendente' : 'concluido'

    if (API_BASE_URL) {
      try {
        const response = await fetch(`${API_BASE_URL}/tarefas/${id}/status`, {
          method: 'PATCH',
          headers: getAuthHeaders(),
          body: JSON.stringify({ status: novoStatus }),
        })
        if (response.ok) {
          return (await response.json()) as Tarefa
        }
      } catch {
        // Fallback para armazenamento local
      }
    }

    return this.atualizar(id, { status: novoStatus })
  },

  async excluir(id: number): Promise<void> {
    if (API_BASE_URL) {
      try {
        const response = await fetch(`${API_BASE_URL}/tarefas/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
        })
        if (response.ok) {
          return
        }
      } catch {
        // Fallback para armazenamento local
      }
    }

    const tasks = getStoredTasks()
    const filtered = tasks.filter((t) => t.id !== id)
    saveStoredTasks(filtered)
  },

  async excluirPorProjeto(projetoId: number): Promise<void> {
    const tasks = getStoredTasks()
    const filtered = tasks.filter((t) => t.projeto_id !== projetoId)
    saveStoredTasks(filtered)
  },

  resetMock(): void {
    localStorage.removeItem(TASKS_STORAGE_KEY)
  },
}
