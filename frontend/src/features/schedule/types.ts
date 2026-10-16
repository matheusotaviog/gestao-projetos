export interface Compromisso {
  id: number
  projeto_id: number
  horario_inicio: string
  horario_fim: string
  data_inicio: string
  data_fim: string
  observacao?: string
}

export interface CompromissoInput {
  projeto_id: number
  horario_inicio: string
  horario_fim: string
  data_inicio: string
  data_fim: string
  observacao?: string
}
