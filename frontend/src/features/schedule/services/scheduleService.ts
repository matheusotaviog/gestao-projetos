import type { Compromisso, CompromissoInput } from '../types'
import { authService } from '../../auth/services/authService'

const SCHEDULE_STORAGE_KEY = 'gestao_projetos_cronograma'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

const INITIAL_SCHEDULE: Compromisso[] = [
  {
    id: 1,
    projeto_id: 1,
    data_inicio: '2026-08-20',
    data_fim: '2026-08-20',
    horario_inicio: '14:00',
    horario_fim: '16:00',
    observacao: 'Revisão de árvores binárias e exercícios práticos.',
  },
  {
    id: 2,
    projeto_id: 2,
    data_inicio: '2026-08-21',
    data_fim: '2026-08-21',
    horario_inicio: '09:00',
    horario_fim: '11:00',
    observacao: 'Prática de consultas SQL com JOIN.',
  },
]

function getStoredSchedule(): Compromisso[] {
  const raw = localStorage.getItem(SCHEDULE_STORAGE_KEY)
  if (!raw) {
    const clones = INITIAL_SCHEDULE.map((item) => ({ ...item }))
    localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(clones))
    return clones
  }

  try {
    return JSON.parse(raw) as Compromisso[]
  } catch (err) {
    console.warn(`Falha ao ler ${SCHEDULE_STORAGE_KEY} do localStorage:`, err)
    return INITIAL_SCHEDULE.map((item) => ({ ...item }))
  }
}

function saveStoredSchedule(compromissos: Compromisso[]): void {
  localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(compromissos))
}

function getAuthHeaders(): HeadersInit {
  const token = authService.getToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

function validarCompromisso(dados: CompromissoInput): void {
  if (!Number.isInteger(dados.projeto_id) || dados.projeto_id <= 0) {
    throw new Error('Selecione um projeto válido.')
  }

  if (!dados.data_inicio.trim() || !dados.data_fim.trim()) {
    throw new Error('As datas de início e fim são obrigatórias.')
  }

  if (dados.data_fim < dados.data_inicio) {
    throw new Error('A data de fim não pode ser anterior à data de início.')
  }

  if (!dados.horario_inicio.trim() || !dados.horario_fim.trim()) {
    throw new Error('Os horários de início e fim são obrigatórios.')
  }

  if (dados.horario_fim <= dados.horario_inicio) {
    throw new Error('O horário de fim deve ser posterior ao horário de início.')
  }
}

export const scheduleService = {
  async listar(): Promise<Compromisso[]> {
    if (API_BASE_URL) {
      try {
        const response = await fetch(`${API_BASE_URL}/cronogramas`, {
          headers: getAuthHeaders(),
        })
        if (response.ok) {
          return (await response.json()) as Compromisso[]
        }
      } catch (err) {
        console.warn('Falha ao buscar cronogramas na API, usando armazenamento local:', err)
      }
    }

    return getStoredSchedule()
  },

  async criar(dados: CompromissoInput): Promise<Compromisso> {
    validarCompromisso(dados)

    const payload: CompromissoInput = {
      projeto_id: dados.projeto_id,
      data_inicio: dados.data_inicio.trim(),
      data_fim: dados.data_fim.trim(),
      horario_inicio: dados.horario_inicio.trim(),
      horario_fim: dados.horario_fim.trim(),
      ...(dados.observacao?.trim() ? { observacao: dados.observacao.trim() } : {}),
    }

    if (API_BASE_URL) {
      try {
        const response = await fetch(`${API_BASE_URL}/cronogramas`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        })
        if (response.ok) {
          return (await response.json()) as Compromisso
        }
      } catch (err) {
        console.warn(`Falha ao criar compromisso para projeto ${dados.projeto_id} na API:`, err)
      }
    }

    const compromissos = getStoredSchedule()
    const nextId = compromissos.length > 0 ? Math.max(...compromissos.map((c) => c.id)) + 1 : 1
    const novoCompromisso: Compromisso = {
      id: nextId,
      ...payload,
    }

    compromissos.push(novoCompromisso)
    saveStoredSchedule(compromissos)
    return novoCompromisso
  },

  resetMock(): void {
    localStorage.removeItem(SCHEDULE_STORAGE_KEY)
  },
}
