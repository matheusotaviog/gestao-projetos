import { useState, type FormEvent } from 'react'
import { Modal } from '../../../components/ui/Modal'
import type { Projeto } from '../../projects/types'
import type { CompromissoInput } from '../types'
import styles from '../../tasks/components/TaskFormModal.module.css'

export interface ScheduleFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (dados: CompromissoInput) => Promise<void>
  projetos: Projeto[]
  isLoading?: boolean
}

function ScheduleFormContent({
  onClose,
  onSubmit,
  projetos,
  isLoading = false,
}: Omit<ScheduleFormModalProps, 'isOpen'>) {
  const [projetoId, setProjetoId] = useState<number>(() => projetos[0]?.id ?? 0)
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [horarioInicio, setHorarioInicio] = useState('')
  const [horarioFim, setHorarioFim] = useState('')
  const [observacao, setObservacao] = useState('')
  const [erro, setErro] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault()
    setErro('')

    if (!projetoId) {
      setErro('Selecione um projeto válido.')
      return
    }

    if (!dataInicio || !dataFim) {
      setErro('As datas de início e fim são obrigatórias.')
      return
    }

    if (dataFim < dataInicio) {
      setErro('A data de fim não pode ser anterior à data de início.')
      return
    }

    if (!horarioInicio || !horarioFim) {
      setErro('Os horários de início e fim são obrigatórios.')
      return
    }

    if (horarioFim <= horarioInicio) {
      setErro('O horário de fim deve ser posterior ao horário de início.')
      return
    }

    try {
      await onSubmit({
        projeto_id: projetoId,
        data_inicio: dataInicio,
        data_fim: dataFim,
        horario_inicio: horarioInicio,
        horario_fim: horarioFim,
        ...(observacao.trim() ? { observacao: observacao.trim() } : {}),
      })
      onClose()
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao salvar compromisso.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      {erro && <div className={styles.errorBanner}>{erro}</div>}

      <div className={styles.formGroup}>
        <label htmlFor="compromisso-projeto" className={styles.label}>
          Projeto / Matéria <span className={styles.required}>*</span>
        </label>
        <select
          id="compromisso-projeto"
          className={styles.select}
          value={projetoId}
          onChange={(e) => setProjetoId(Number(e.target.value))}
          required
        >
          <option value={0}>Selecione um projeto</option>
          {projetos.map((projeto) => (
            <option key={projeto.id} value={projeto.id}>
              {projeto.nome}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.row}>
        <div className={styles.formGroup}>
          <label htmlFor="compromisso-data-inicio" className={styles.label}>
            Data de Início <span className={styles.required}>*</span>
          </label>
          <input
            id="compromisso-data-inicio"
            type="date"
            className={styles.input}
            value={dataInicio}
            onChange={(e) => {
              setDataInicio(e.target.value)
              if (!dataFim) setDataFim(e.target.value)
            }}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="compromisso-data-fim" className={styles.label}>
            Data de Fim <span className={styles.required}>*</span>
          </label>
          <input
            id="compromisso-data-fim"
            type="date"
            className={styles.input}
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            required
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.formGroup}>
          <label htmlFor="compromisso-horario-inicio" className={styles.label}>
            Horário de Início <span className={styles.required}>*</span>
          </label>
          <input
            id="compromisso-horario-inicio"
            type="time"
            className={styles.input}
            value={horarioInicio}
            onChange={(e) => setHorarioInicio(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="compromisso-horario-fim" className={styles.label}>
            Horário de Fim <span className={styles.required}>*</span>
          </label>
          <input
            id="compromisso-horario-fim"
            type="time"
            className={styles.input}
            value={horarioFim}
            onChange={(e) => setHorarioFim(e.target.value)}
            required
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="compromisso-observacao" className={styles.label}>
          Observações
        </label>
        <textarea
          id="compromisso-observacao"
          className={styles.textarea}
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
          placeholder="Tópicos de estudo ou objetivos da sessão..."
          rows={3}
          maxLength={500}
        />
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={onClose}
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? 'Salvando...' : 'Salvar Compromisso'}
        </button>
      </div>
    </form>
  )
}

export function ScheduleFormModal({
  isOpen,
  onClose,
  onSubmit,
  projetos,
  isLoading = false,
}: ScheduleFormModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Novo Compromisso" size="medium">
      {isOpen && (
        <ScheduleFormContent
          onClose={onClose}
          onSubmit={onSubmit}
          projetos={projetos}
          isLoading={isLoading}
        />
      )}
    </Modal>
  )
}
