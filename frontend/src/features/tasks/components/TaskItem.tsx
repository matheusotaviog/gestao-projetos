import type { Tarefa } from '../types'
import styles from './TaskItem.module.css'

interface TaskItemProps {
  tarefa: Tarefa
  onToggleStatus: (id: number) => void
  onEdit: (tarefa: Tarefa) => void
  onDelete: (tarefa: Tarefa) => void
}

function formatarDataEntrega(dataStr?: string | null): {
  texto: string
  classe: string
} | null {
  if (!dataStr) return null

  // Trata formato YYYY-MM-DD
  const partes = dataStr.split('-')
  if (partes.length !== 3) return { texto: dataStr, classe: styles.prazoNormal }

  const ano = parseInt(partes[0], 10)
  const mes = parseInt(partes[1], 10) - 1
  const dia = parseInt(partes[2], 10)
  const dataEntrega = new Date(ano, mes, dia)

  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  dataEntrega.setHours(0, 0, 0, 0)

  const formatado = `${String(dia).padStart(2, '0')}/${String(mes + 1).padStart(2, '0')}/${ano}`

  const diffTime = dataEntrega.getTime() - hoje.getTime()
  const diffDias = Math.round(diffTime / (1000 * 60 * 60 * 24))

  if (diffDias < 0) {
    return { texto: `Venceu em ${formatado}`, classe: styles.prazoAtrasado }
  } else if (diffDias === 0) {
    return { texto: 'Entrega hoje', classe: styles.prazoHoje }
  } else {
    return { texto: `Entrega: ${formatado}`, classe: styles.prazoNormal }
  }
}

export function TaskItem({
  tarefa,
  onToggleStatus,
  onEdit,
  onDelete,
}: TaskItemProps) {
  const isConcluida = tarefa.status === 'concluido'
  const prazoInfo = formatarDataEntrega(tarefa.data_entrega)

  return (
    <div
      className={`${styles.item} ${isConcluida ? styles.itemConcluida : ''}`}
      data-testid={`task-item-${tarefa.id}`}
    >
      <div className={styles.checkboxWrapper}>
        <button
          type="button"
          role="checkbox"
          aria-checked={isConcluida}
          className={`${styles.checkbox} ${isConcluida ? styles.checkboxChecked : ''}`}
          onClick={() => onToggleStatus(tarefa.id)}
          aria-label={
            isConcluida
              ? `Marcar "${tarefa.titulo}" como pendente`
              : `Marcar "${tarefa.titulo}" como concluída`
          }
        >
          {isConcluida && <span className={styles.checkIcon}>✓</span>}
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <span
            className={`${styles.titulo} ${isConcluida ? styles.tituloConcluido : ''}`}
          >
            {tarefa.titulo}
          </span>
          <span
            className={`${styles.statusBadge} ${isConcluida ? styles.statusConcluido : styles.statusPendente}`}
          >
            {isConcluida ? 'Concluída' : 'Pendente'}
          </span>
        </div>

        {tarefa.observacao && (
          <p className={styles.observacao}>{tarefa.observacao}</p>
        )}

        <div className={styles.footer}>
          {prazoInfo && (
            <span
              className={`${styles.prazoBadge} ${isConcluida ? styles.prazoConcluido : prazoInfo.classe}`}
            >
              📅 {prazoInfo.texto}
            </span>
          )}
        </div>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.actionButton}
          onClick={() => onEdit(tarefa)}
          aria-label={`Editar tarefa ${tarefa.titulo}`}
        >
          Editar
        </button>
        <button
          type="button"
          className={`${styles.actionButton} ${styles.actionDelete}`}
          onClick={() => onDelete(tarefa)}
          aria-label={`Excluir tarefa ${tarefa.titulo}`}
        >
          Excluir
        </button>
      </div>
    </div>
  )
}
