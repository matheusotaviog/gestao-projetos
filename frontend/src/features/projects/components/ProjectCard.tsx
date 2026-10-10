import { Link } from 'react-router'
import type { ProjetoComTarefas } from '../types'
import styles from './ProjectCard.module.css'

interface ProjectCardProps {
  projeto: ProjetoComTarefas
  onEdit: (projeto: ProjetoComTarefas) => void
  onDelete: (projeto: ProjetoComTarefas) => void
}

function formatarData(dataIso: string): string {
  try {
    const data = new Date(dataIso)
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  } catch {
    return dataIso
  }
}

export function ProjectCard({ projeto, onEdit, onDelete }: ProjectCardProps) {
  const dataFormatada = formatarData(projeto.data_criacao)

  return (
    <article className={styles.card} data-testid={`project-card-${projeto.id}`}>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <Link to={`/projetos/${projeto.id}`} className={styles.titleLink}>
            <h3 className={styles.title}>{projeto.nome}</h3>
          </Link>
          <span className={styles.date}>Criado em {dataFormatada}</span>
        </div>
      </div>

      <p className={styles.description}>
        {projeto.descricao || 'Sem descrição cadastrada.'}
      </p>

      <div className={styles.taskInfo}>
        <span className={styles.taskBadge}>
          📋 {projeto.totalTarefas} {projeto.totalTarefas === 1 ? 'tarefa cadastrada' : 'tarefas cadastradas'}
        </span>
      </div>

      <div className={styles.footer}>
        <Link to={`/projetos/${projeto.id}`} className={styles.manageButton}>
          Gerenciar Tarefas →
        </Link>
        <div className={styles.actionButtons}>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => onEdit(projeto)}
            aria-label={`Editar projeto ${projeto.nome}`}
          >
            Editar
          </button>
          <button
            type="button"
            className={`${styles.secondaryButton} ${styles.deleteButton}`}
            onClick={() => onDelete(projeto)}
            aria-label={`Excluir projeto ${projeto.nome}`}
          >
            Excluir
          </button>
        </div>
      </div>
    </article>
  )
}
