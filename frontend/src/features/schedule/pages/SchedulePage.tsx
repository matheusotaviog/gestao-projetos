import { useEffect, useState } from 'react'
import type { Projeto } from '../../projects/types'
import { projectService } from '../../projects/services/projectService'
import { ScheduleFormModal } from '../components/ScheduleFormModal'
import { scheduleService } from '../services/scheduleService'
import type { Compromisso, CompromissoInput } from '../types'
import pageStyles from '../../projects/pages/ProjectsPage.module.css'
import styles from './SchedulePage.module.css'

function formatarData(isoDate: string): string {
  const partes = isoDate.split('-')
  if (partes.length !== 3) return isoDate
  return `${partes[2]}/${partes[1]}/${partes[0]}`
}

function formatarPeriodo(item: Compromisso): string {
  const inicio = formatarData(item.data_inicio)
  const fim = formatarData(item.data_fim)
  const datas = item.data_inicio === item.data_fim ? inicio : `${inicio} até ${fim}`
  return `${datas} • ${item.horario_inicio} - ${item.horario_fim}`
}

export function SchedulePage() {
  const [compromissos, setCompromissos] = useState<Compromisso[]>([])
  const [projetos, setProjetos] = useState<Projeto[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [modalAberto, setModalAberto] = useState(false)
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    let ativo = true
    Promise.all([scheduleService.listar(), projectService.listar()])
      .then(([listaCompromissos, listaProjetos]) => {
        if (!ativo) return
        setCompromissos(listaCompromissos)
        setProjetos(listaProjetos)
        setCarregando(false)
      })
      .catch((err) => {
        if (!ativo) return
        setErro(err instanceof Error ? err.message : 'Erro ao carregar cronograma.')
        setCarregando(false)
      })

    return () => {
      ativo = false
    }
  }, [])

  async function handleCriarCompromisso(dados: CompromissoInput): Promise<void> {
    setSalvando(true)
    try {
      await scheduleService.criar(dados)
      const atualizados = await scheduleService.listar()
      setCompromissos(atualizados)
    } finally {
      setSalvando(false)
    }
  }

  function obterNomeProjeto(projetoId: number): string {
    return projetos.find((p) => p.id === projetoId)?.nome ?? `Projeto #${projetoId}`
  }

  return (
    <div className={pageStyles.container}>
      <header className={pageStyles.header}>
        <div>
          <h1 className={pageStyles.title}>Cronograma</h1>
          <p className={pageStyles.subtitle}>
            Planejamento de compromissos e horários de estudo.
          </p>
        </div>
        <button
          type="button"
          className={pageStyles.newButton}
          onClick={() => setModalAberto(true)}
        >
          + Novo Compromisso
        </button>
      </header>

      {erro && <div className={pageStyles.errorAlert}>{erro}</div>}

      {carregando ? (
        <div className={pageStyles.loadingState}>
          <p>Carregando compromissos...</p>
        </div>
      ) : compromissos.length === 0 ? (
        <div className={pageStyles.emptyState}>
          <h3>Nenhum compromisso cadastrado</h3>
          <p>Cadastre um compromisso para organizar seus horários de estudo.</p>
          <button
            type="button"
            className={pageStyles.newButton}
            onClick={() => setModalAberto(true)}
          >
            + Cadastrar Compromisso
          </button>
        </div>
      ) : (
        <div className={styles.list}>
          {compromissos.map((item) => (
            <article key={item.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.projectName}>{obterNomeProjeto(item.projeto_id)}</h3>
                <span className={styles.scheduleMeta}>{formatarPeriodo(item)}</span>
              </div>
              {item.observacao && (
                <p className={styles.observation}>{item.observacao}</p>
              )}
            </article>
          ))}
        </div>
      )}

      <ScheduleFormModal
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        onSubmit={handleCriarCompromisso}
        projetos={projetos}
        isLoading={salvando}
      />
    </div>
  )
}
