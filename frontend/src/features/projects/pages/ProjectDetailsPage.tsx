import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router'
import type { ProjetoComTarefas, ProjetoInput } from '../types'
import type { Tarefa, TarefaInput } from '../../tasks/types'
import { projectService } from '../services/projectService'
import { taskService } from '../../tasks/services/taskService'
import { TaskList } from '../../tasks/components/TaskList'
import { TaskFormModal } from '../../tasks/components/TaskFormModal'
import { ProjectFormModal } from '../components/ProjectFormModal'
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog'
import { Toast } from '../../../components/ui/Toast'
import styles from './ProjectDetailsPage.module.css'

function formatarData(dataIso?: string): string {
  if (!dataIso) return ''
  try {
    return new Date(dataIso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  } catch {
    return dataIso
  }
}

export function ProjectDetailsPage() {
  const { projetoId } = useParams<{ projetoId: string }>()
  const navigate = useNavigate()
  const idNumerico = Number(projetoId)

  const [projeto, setProjeto] = useState<ProjetoComTarefas | null>(null)
  const [tarefas, setTarefas] = useState<Tarefa[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  const [modalEditarProjetoAberto, setModalEditarProjetoAberto] = useState(false)
  const [salvandoProjeto, setSalvandoProjeto] = useState(false)
  const [confirmarExclusaoProjeto, setConfirmarExclusaoProjeto] = useState(false)
  const [excluindoProjeto, setExcluindoProjeto] = useState(false)

  const [modalTarefaAberto, setModalTarefaAberto] = useState(false)
  const [tarefaEmEdicao, setTarefaEmEdicao] = useState<Tarefa | null>(null)
  const [salvandoTarefa, setSalvandoTarefa] = useState(false)
  const [tarefaParaExcluir, setTarefaParaExcluir] = useState<Tarefa | null>(null)
  const [excluindoTarefa, setExcluindoTarefa] = useState(false)

  const [toast, setToast] = useState<{
    message: string
    actionLabel?: string
    onAction?: () => void
  } | null>(null)

  const idInvalido = isNaN(idNumerico)

  async function recarregar() {
    if (idInvalido) return
    try {
      const [proj, taskList] = await Promise.all([
        projectService.buscarPorId(idNumerico),
        taskService.listarPorProjeto(idNumerico),
      ])
      if (proj) {
        setProjeto(proj)
        setTarefas(taskList)
      }
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao carregar dados do projeto.')
    }
  }

  useEffect(() => {
    if (isNaN(idNumerico)) {
      return
    }

    let ativo = true
    Promise.all([
      projectService.buscarPorId(idNumerico),
      taskService.listarPorProjeto(idNumerico),
    ])
      .then(([proj, taskList]) => {
        if (!ativo) return
        if (!proj) {
          setErro('Projeto não encontrado.')
        } else {
          setProjeto(proj)
          setTarefas(taskList)
        }
        setCarregando(false)
      })
      .catch((err) => {
        if (!ativo) return
        setErro(err instanceof Error ? err.message : 'Erro ao carregar dados do projeto.')
        setCarregando(false)
      })

    return () => {
      ativo = false
    }
  }, [idNumerico])

  // Ações de Projeto (RF02)
  async function handleSalvarProjeto(dados: ProjetoInput) {
    if (!projeto) return
    setSalvandoProjeto(true)
    try {
      const atualizado = await projectService.atualizar(projeto.id, dados)
      setProjeto(atualizado)
    } finally {
      setSalvandoProjeto(false)
    }
  }

  async function handleExcluirProjeto() {
    if (!projeto) return
    const proj = projeto
    const tarefasDoProjeto = tarefas
    setExcluindoProjeto(true)
    try {
      await projectService.excluir(proj.id)
      navigate('/projetos', {
        state: {
          toast: {
            projeto: proj,
            tarefas: tarefasDoProjeto,
          },
        },
      })
    } finally {
      setExcluindoProjeto(false)
    }
  }

  async function handleToggleStatusTarefa(id: number) {
    try {
      await taskService.alternarStatus(id)
      await recarregar()
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao alterar status da tarefa.')
    }
  }

  function handleAbrirCriarTarefa() {
    setTarefaEmEdicao(null)
    setModalTarefaAberto(true)
  }

  function handleAbrirEditarTarefa(tarefa: Tarefa) {
    setTarefaEmEdicao(tarefa)
    setModalTarefaAberto(true)
  }

  async function handleSalvarTarefa(dados: TarefaInput) {
    if (!projeto) return
    setSalvandoTarefa(true)
    try {
      if (tarefaEmEdicao) {
        await taskService.atualizar(tarefaEmEdicao.id, dados)
      } else {
        await taskService.criar(projeto.id, dados)
      }
      await recarregar()
    } finally {
      setSalvandoTarefa(false)
    }
  }

  async function handleConfirmarExcluirTarefa() {
    if (!tarefaParaExcluir) return
    const tarefaRemovida = tarefaParaExcluir
    setExcluindoTarefa(true)
    try {
      await taskService.excluir(tarefaRemovida.id)
      setTarefaParaExcluir(null)
      await recarregar()

      setToast({
        message: 'Tarefa excluída com sucesso.',
        actionLabel: 'Desfazer',
        onAction: async () => {
          await taskService.restaurar(tarefaRemovida)
          await recarregar()
        },
      })
    } finally {
      setExcluindoTarefa(false)
    }
  }

  if (carregando) {
    return (
      <div className={styles.loadingContainer}>
        <p>Carregando dados da disciplina...</p>
      </div>
    )
  }

  if (idInvalido || erro || !projeto) {
    return (
      <div className={styles.errorContainer}>
        <h2>{idInvalido ? 'Identificador de projeto inválido.' : (erro || 'Projeto não encontrado')}</h2>
        <Link to="/projetos" className={styles.backLink}>
          ← Voltar para lista de projetos
        </Link>
      </div>
    )
  }

  const totalCount = tarefas.length

  return (
    <div className={styles.container}>
      <nav aria-label="Navegação estrutural" className={styles.breadcrumb}>
        <Link to="/projetos" className={styles.breadcrumbLink}>
          ← Todos os Projetos
        </Link>
      </nav>

      {/* Cartão de Detalhes do Projeto */}
      <header className={styles.projectCard}>
        <div className={styles.projectHeaderTop}>
          <div>
            <h1 className={styles.projectTitle}>{projeto.nome}</h1>
            <span className={styles.projectDate}>
              Criado em {formatarData(projeto.data_criacao)}
            </span>
          </div>

          <div className={styles.projectActions}>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => setModalEditarProjetoAberto(true)}
            >
              Editar Projeto
            </button>
            <button
              type="button"
              className={`${styles.secondaryButton} ${styles.deleteButton}`}
              onClick={() => setConfirmarExclusaoProjeto(true)}
            >
              Excluir Projeto
            </button>
          </div>
        </div>

        <p className={styles.projectDescription}>
          {projeto.descricao || 'Nenhuma ementa ou descrição informada para este projeto.'}
        </p>

        <div className={styles.taskMeta}>
          <span className={styles.taskMetaBadge}>
            📋 {totalCount} {totalCount === 1 ? 'tarefa cadastrada' : 'tarefas cadastradas'}
          </span>
        </div>
      </header>

      <section className={styles.tasksSection}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Tarefas do Projeto</h2>
            <p className={styles.sectionSubtitle}>
              Cadastre tarefas para organizar as atividades desta matéria.
            </p>
          </div>
        </div>

        <TaskList
          tarefas={tarefas}
          onToggleStatus={handleToggleStatusTarefa}
          onEdit={handleAbrirEditarTarefa}
          onDelete={setTarefaParaExcluir}
          onNewTask={handleAbrirCriarTarefa}
        />
      </section>

      <ProjectFormModal
        isOpen={modalEditarProjetoAberto}
        onClose={() => setModalEditarProjetoAberto(false)}
        onSubmit={handleSalvarProjeto}
        projetoParaEditar={projeto}
        isLoading={salvandoProjeto}
      />

      <ConfirmDialog
        isOpen={confirmarExclusaoProjeto}
        onClose={() => setConfirmarExclusaoProjeto(false)}
        onConfirm={handleExcluirProjeto}
        title="Excluir Projeto"
        message={`Tem certeza que deseja excluir o projeto "${projeto.nome}"? Todas as tarefas desta disciplina também serão removidas permanentemente.`}
        confirmLabel="Sim, excluir projeto"
        cancelLabel="Cancelar"
        isLoading={excluindoProjeto}
        isDestructive
      />

      <TaskFormModal
        isOpen={modalTarefaAberto}
        onClose={() => setModalTarefaAberto(false)}
        onSubmit={handleSalvarTarefa}
        tarefaParaEditar={tarefaEmEdicao}
        isLoading={salvandoTarefa}
      />

      <ConfirmDialog
        isOpen={Boolean(tarefaParaExcluir)}
        onClose={() => setTarefaParaExcluir(null)}
        onConfirm={handleConfirmarExcluirTarefa}
        title="Excluir Tarefa"
        message={`Deseja excluir a tarefa "${tarefaParaExcluir?.titulo}"?`}
        confirmLabel="Sim, excluir tarefa"
        cancelLabel="Cancelar"
        isLoading={excluindoTarefa}
        isDestructive
      />

      {toast && (
        <Toast
          message={toast.message}
          actionLabel={toast.actionLabel}
          onAction={toast.onAction}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
