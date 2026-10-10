import { useState, type FormEvent } from 'react'
import { Modal } from '../../../components/ui/Modal'
import type { Tarefa, TarefaInput, TarefaStatus } from '../types'
import styles from './TaskFormModal.module.css'

interface TaskFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (dados: TarefaInput) => Promise<void>
  tarefaParaEditar?: Tarefa | null
  isLoading?: boolean
}

interface FormContentProps {
  onClose: () => void
  onSubmit: (dados: TarefaInput) => Promise<void>
  tarefaParaEditar?: Tarefa | null
  isLoading: boolean
}

function TaskFormContent({
  onClose,
  onSubmit,
  tarefaParaEditar,
  isLoading,
}: FormContentProps) {
  const [titulo, setTitulo] = useState(() => tarefaParaEditar?.titulo ?? '')
  const [dataEntrega, setDataEntrega] = useState(() => tarefaParaEditar?.data_entrega ?? '')
  const [observacao, setObservacao] = useState(() => tarefaParaEditar?.observacao ?? '')
  const [status, setStatus] = useState<TarefaStatus>(() => tarefaParaEditar?.status ?? 'pendente')
  const [erro, setErro] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErro(null)

    if (!titulo.trim()) {
      setErro('O título da tarefa é obrigatório.')
      return
    }

    try {
      await onSubmit({
        titulo: titulo.trim(),
        data_entrega: dataEntrega || null,
        observacao: observacao.trim() || null,
        status,
      })
      onClose()
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao salvar tarefa.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {erro && <div className={styles.errorBanner}>{erro}</div>}

      <div className={styles.formGroup}>
        <label htmlFor="task-titulo" className={styles.label}>
          Título da Tarefa <span className={styles.required}>*</span>
        </label>
        <input
          id="task-titulo"
          type="text"
          className={styles.input}
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Ex: Resolver lista de exercícios de grafos"
          maxLength={150}
          required
          autoFocus
        />
      </div>

      <div className={styles.row}>
        <div className={styles.formGroup}>
          <label htmlFor="task-data-entrega" className={styles.label}>
            Data de Entrega
          </label>
          <input
            id="task-data-entrega"
            type="date"
            className={styles.input}
            value={dataEntrega}
            onChange={(e) => setDataEntrega(e.target.value)}
          />
        </div>

        {tarefaParaEditar && (
          <div className={styles.formGroup}>
            <label htmlFor="task-status" className={styles.label}>
              Status
            </label>
            <select
              id="task-status"
              className={styles.select}
              value={status}
              onChange={(e) => setStatus(e.target.value as TarefaStatus)}
            >
              <option value="pendente">Pendente</option>
              <option value="concluido">Concluída</option>
            </select>
          </div>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="task-observacao" className={styles.label}>
          Observações / Anotações
        </label>
        <textarea
          id="task-observacao"
          className={styles.textarea}
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
          placeholder="Anotações adicionais, referências bibliográficas ou links..."
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
          {isLoading ? 'Salvando...' : 'Salvar Tarefa'}
        </button>
      </div>
    </form>
  )
}

export function TaskFormModal({
  isOpen,
  onClose,
  onSubmit,
  tarefaParaEditar,
  isLoading = false,
}: TaskFormModalProps) {
  const tituloModal = tarefaParaEditar ? 'Editar Tarefa' : 'Nova Tarefa'

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={tituloModal} size="medium">
      {isOpen && (
        <TaskFormContent
          key={tarefaParaEditar ? `edit-${tarefaParaEditar.id}` : 'create'}
          onClose={onClose}
          onSubmit={onSubmit}
          tarefaParaEditar={tarefaParaEditar}
          isLoading={isLoading}
        />
      )}
    </Modal>
  )
}
