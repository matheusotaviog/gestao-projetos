import { useState, useMemo } from 'react'
import type { Tarefa, TarefaFiltroStatus } from '../types'
import { TaskItem } from './TaskItem'
import styles from './TaskList.module.css'

interface TaskListProps {
  tarefas: Tarefa[]
  onToggleStatus: (id: number) => void
  onEdit: (tarefa: Tarefa) => void
  onDelete: (tarefa: Tarefa) => void
  onNewTask: () => void
}

export function TaskList({
  tarefas,
  onToggleStatus,
  onEdit,
  onDelete,
  onNewTask,
}: TaskListProps) {
  const [filtroStatus, setFiltroStatus] = useState<TarefaFiltroStatus>('todas')
  const [busca, setBusca] = useState('')

  const contagem = useMemo(() => {
    const total = tarefas.length
    const concluidas = tarefas.filter((t) => t.status === 'concluido').length
    const pendentes = total - concluidas
    return { total, concluidas, pendentes }
  }, [tarefas])

  const tarefasFiltradas = useMemo(() => {
    return tarefas.filter((tarefa) => {
      // Filtro de status
      if (filtroStatus === 'pendentes' && tarefa.status !== 'pendente') return false
      if (filtroStatus === 'concluidas' && tarefa.status !== 'concluido') return false

      // Filtro de busca textual
      if (busca.trim()) {
        const termo = busca.toLowerCase()
        const matchTitulo = tarefa.titulo.toLowerCase().includes(termo)
        const matchObs = tarefa.observacao?.toLowerCase().includes(termo) ?? false
        if (!matchTitulo && !matchObs) return false
      }

      return true
    })
  }, [tarefas, filtroStatus, busca])

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <div className={styles.tabs} role="tablist" aria-label="Filtrar tarefas por status">
          <button
            type="button"
            role="tab"
            aria-selected={filtroStatus === 'todas'}
            className={`${styles.tab} ${filtroStatus === 'todas' ? styles.tabActive : ''}`}
            onClick={() => setFiltroStatus('todas')}
          >
            Todas ({contagem.total})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={filtroStatus === 'pendentes'}
            className={`${styles.tab} ${filtroStatus === 'pendentes' ? styles.tabActive : ''}`}
            onClick={() => setFiltroStatus('pendentes')}
          >
            Pendentes ({contagem.pendentes})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={filtroStatus === 'concluidas'}
            className={`${styles.tab} ${filtroStatus === 'concluidas' ? styles.tabActive : ''}`}
            onClick={() => setFiltroStatus('concluidas')}
          >
            Concluídas ({contagem.concluidas})
          </button>
        </div>

        <div className={styles.actionsBar}>
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Buscar nas tarefas..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            aria-label="Buscar tarefas"
          />
          <button
            type="button"
            className={styles.newButton}
            onClick={onNewTask}
          >
            + Nova Tarefa
          </button>
        </div>
      </div>

      {tarefasFiltradas.length === 0 ? (
        <div className={styles.emptyState}>
          {tarefas.length === 0 ? (
            <>
              <p className={styles.emptyText}>
                Nenhuma tarefa cadastrada para este projeto ainda.
              </p>
              <button
                type="button"
                className={styles.emptyButton}
                onClick={onNewTask}
              >
                + Criar Primeira Tarefa
              </button>
            </>
          ) : (
            <p className={styles.emptyText}>
              Nenhuma tarefa encontrada com os filtros selecionados.
            </p>
          )}
        </div>
      ) : (
        <div className={styles.list}>
          {tarefasFiltradas.map((tarefa) => (
            <TaskItem
              key={tarefa.id}
              tarefa={tarefa}
              onToggleStatus={onToggleStatus}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
