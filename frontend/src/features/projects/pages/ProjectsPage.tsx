import { useState, useEffect, useMemo } from 'react'
import type { ProjetoComTarefas, ProjetoInput } from '../types'
import { projectService } from '../services/projectService'
import { ProjectCard } from '../components/ProjectCard'
import { ProjectFormModal } from '../components/ProjectFormModal'
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog'
import styles from './ProjectsPage.module.css'

export function ProjectsPage() {
  const [projetos, setProjetos] = useState<ProjetoComTarefas[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [busca, setBusca] = useState('')

  // Estado para Modal de Criação / Edição de Projeto (RF02)
  const [modalFormAberto, setModalFormAberto] = useState(false)
  const [projetoEmEdicao, setProjetoEmEdicao] = useState<ProjetoComTarefas | null>(null)
  const [salvandoProjeto, setSalvandoProjeto] = useState(false)

  // Estado para Confirmação de Exclusão (RF02)
  const [projetoParaExcluir, setProjetoParaExcluir] = useState<ProjetoComTarefas | null>(null)
  const [excluindoProjeto, setExcluindoProjeto] = useState(false)

  async function recarregar() {
    try {
      const dados = await projectService.listar()
      setProjetos(dados)
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao carregar projetos.')
    }
  }

  useEffect(() => {
    let ativo = true
    projectService
      .listar()
      .then((dados) => {
        if (ativo) {
          setProjetos(dados)
          setCarregando(false)
        }
      })
      .catch((err) => {
        if (ativo) {
          setErro(err instanceof Error ? err.message : 'Erro ao carregar projetos.')
          setCarregando(false)
        }
      })

    return () => {
      ativo = false
    }
  }, [])

  // Filtragem por busca
  const projetosFiltrados = useMemo(() => {
    if (!busca.trim()) return projetos
    const termo = busca.toLowerCase()
    return projetos.filter(
      (p) =>
        p.nome.toLowerCase().includes(termo) ||
        (p.descricao && p.descricao.toLowerCase().includes(termo)),
    )
  }, [projetos, busca])

  function handleAbrirCriacao() {
    setProjetoEmEdicao(null)
    setModalFormAberto(true)
  }

  function handleAbrirEdicao(projeto: ProjetoComTarefas) {
    setProjetoEmEdicao(projeto)
    setModalFormAberto(true)
  }

  async function handleSalvarProjeto(dados: ProjetoInput) {
    setSalvandoProjeto(true)
    try {
      if (projetoEmEdicao) {
        await projectService.atualizar(projetoEmEdicao.id, dados)
      } else {
        await projectService.criar(dados)
      }
      await recarregar()
    } finally {
      setSalvandoProjeto(false)
    }
  }

  async function handleConfirmarExclusao() {
    if (!projetoParaExcluir) return
    setExcluindoProjeto(true)
    try {
      await projectService.excluir(projetoParaExcluir.id)
      setProjetoParaExcluir(null)
      await recarregar()
    } finally {
      setExcluindoProjeto(false)
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Projetos e Matérias</h1>
          <p className={styles.subtitle}>
            Gerenciamento de projetos de estudo e acompanhamento de tarefas (RF02).
          </p>
        </div>
        <button
          type="button"
          className={styles.newButton}
          onClick={handleAbrirCriacao}
        >
          + Novo Projeto
        </button>
      </header>

      {erro && <div className={styles.errorAlert}>{erro}</div>}

      {/* Barra de Ferramentas / Filtros */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrapper}>
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Buscar por nome ou ementa da matéria..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            aria-label="Buscar projetos"
          />
        </div>
        <span className={styles.counterText}>
          {projetosFiltrados.length} projeto{projetosFiltrados.length === 1 ? '' : 's'}{' '}
          encontrado{projetosFiltrados.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* Conteúdo principal */}
      {carregando ? (
        <div className={styles.loadingState}>
          <p>Carregando projetos de estudo...</p>
        </div>
      ) : projetosFiltrados.length === 0 ? (
        <div className={styles.emptyState}>
          {projetos.length === 0 ? (
            <>
              <h3>Nenhum projeto cadastrado</h3>
              <p>
                Você ainda não possui projetos ou matérias cadastrados. Crie seu primeiro projeto
                para começar a gerenciar suas tarefas.
              </p>
              <button
                type="button"
                className={styles.newButton}
                onClick={handleAbrirCriacao}
              >
                + Criar Primeiro Projeto
              </button>
            </>
          ) : (
            <>
              <h3>Nenhum projeto encontrado</h3>
              <p>Nenhum resultado corresponde aos termos da busca "{busca}".</p>
              <button
                type="button"
                className={styles.clearSearchButton}
                onClick={() => setBusca('')}
              >
                Limpar busca
              </button>
            </>
          )}
        </div>
      ) : (
        <div className={styles.grid}>
          {projetosFiltrados.map((projeto) => (
            <ProjectCard
              key={projeto.id}
              projeto={projeto}
              onEdit={handleAbrirEdicao}
              onDelete={setProjetoParaExcluir}
            />
          ))}
        </div>
      )}

      {/* Modal de Criação / Edição de Projeto (RF02) */}
      <ProjectFormModal
        isOpen={modalFormAberto}
        onClose={() => setModalFormAberto(false)}
        onSubmit={handleSalvarProjeto}
        projetoParaEditar={projetoEmEdicao}
        isLoading={salvandoProjeto}
      />

      {/* Modal de Confirmação de Exclusão (RF02) */}
      <ConfirmDialog
        isOpen={Boolean(projetoParaExcluir)}
        onClose={() => setProjetoParaExcluir(null)}
        onConfirm={handleConfirmarExclusao}
        title="Excluir Projeto"
        message={`Tem certeza que deseja excluir o projeto "${projetoParaExcluir?.nome}"? Todas as tarefas associadas a ele também serão permanentemente removidas.`}
        confirmLabel="Sim, excluir projeto"
        cancelLabel="Cancelar"
        isLoading={excluindoProjeto}
        isDestructive
      />
    </div>
  )
}
