import { useState, type FormEvent } from 'react'
import { Modal } from '../../../components/ui/Modal'
import type { Projeto, ProjetoInput } from '../types'
import styles from './ProjectFormModal.module.css'

interface ProjectFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (dados: ProjetoInput) => Promise<void>
  projetoParaEditar?: Projeto | null
  isLoading?: boolean
}

interface FormContentProps {
  onClose: () => void
  onSubmit: (dados: ProjetoInput) => Promise<void>
  projetoParaEditar?: Projeto | null
  isLoading: boolean
}

function ProjectFormContent({
  onClose,
  onSubmit,
  projetoParaEditar,
  isLoading,
}: FormContentProps) {
  const [nome, setNome] = useState(() => projetoParaEditar?.nome ?? '')
  const [descricao, setDescricao] = useState(() => projetoParaEditar?.descricao ?? '')
  const [erro, setErro] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErro(null)

    const trimmedNome = nome.trim()
    if (!trimmedNome) {
      setErro('O nome do projeto é obrigatório.')
      return
    }

    if (trimmedNome.length < 2) {
      setErro('O nome do projeto deve ter pelo menos 2 caracteres.')
      return
    }

    try {
      await onSubmit({
        nome: trimmedNome,
        descricao: descricao.trim() || null,
      })
      onClose()
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao salvar projeto.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {erro && <div className={styles.errorBanner}>{erro}</div>}

      <div className={styles.formGroup}>
        <label htmlFor="projeto-nome" className={styles.label}>
          Nome do Projeto / Matéria <span className={styles.required}>*</span>
        </label>
        <input
          id="projeto-nome"
          type="text"
          className={styles.input}
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Ex: Engenharia de Software ou Cálculo I"
          maxLength={150}
          required
          autoFocus
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="projeto-descricao" className={styles.label}>
          Descrição / Ementa
        </label>
        <textarea
          id="projeto-descricao"
          className={styles.textarea}
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Resumo dos tópicos, referências, metas ou objetivos deste projeto..."
          rows={4}
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
          {isLoading ? 'Salvando...' : 'Salvar Projeto'}
        </button>
      </div>
    </form>
  )
}

export function ProjectFormModal({
  isOpen,
  onClose,
  onSubmit,
  projetoParaEditar,
  isLoading = false,
}: ProjectFormModalProps) {
  const tituloModal = projetoParaEditar ? 'Editar Projeto' : 'Novo Projeto'

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={tituloModal} size="medium">
      {isOpen && (
        <ProjectFormContent
          key={projetoParaEditar ? `edit-${projetoParaEditar.id}` : 'create'}
          onClose={onClose}
          onSubmit={onSubmit}
          projetoParaEditar={projetoParaEditar}
          isLoading={isLoading}
        />
      )}
    </Modal>
  )
}
