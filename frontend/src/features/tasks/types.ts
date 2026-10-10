export type TarefaStatus = 'pendente' | 'concluido'

export interface Tarefa {
  id: number
  projeto_id: number
  titulo: string
  status: TarefaStatus
  data_entrega?: string | null
  observacao?: string | null
  data_criacao: string
}

export interface TarefaInput {
  titulo: string
  status?: TarefaStatus
  data_entrega?: string | null
  observacao?: string | null
}

export type TarefaFiltroStatus = 'todas' | 'pendentes' | 'concluidas'
