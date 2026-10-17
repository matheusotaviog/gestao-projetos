export interface Projeto {
  id: number
  usuario_id?: number
  nome: string
  descricao?: string | null
  data_criacao: string
}

export interface ProjetoInput {
  nome: string
  descricao?: string | null
}

export interface ProjetoComTarefas extends Projeto {
  totalTarefas: number
}
