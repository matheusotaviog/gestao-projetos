import { useEffect, useState } from 'react'
import type { Projeto } from '../../services/projetos'
import { TecnologiaIcon } from '../TecnologiasPicker/TecnologiaIcon'

const LIMITE_README = 400

type Props = {
  projeto: Projeto
  onFechar: () => void
}

export function ProjetoModal({ projeto, onFechar }: Props) {
  const [lendoTudo, setLendoTudo] = useState(false)
  const readme = projeto.readme ?? ''
  const readmeLongo = readme.length > LIMITE_README

  useEffect(() => {
    function fecharComEscape(evento: KeyboardEvent) {
      if (evento.key === 'Escape') onFechar()
    }
    document.addEventListener('keydown', fecharComEscape)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', fecharComEscape)
      document.body.style.overflow = overflow
    }
  }, [onFechar])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onFechar()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="projeto-modal-titulo"
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[#0f1015] p-8 text-white shadow-2xl"
      >
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 id="projeto-modal-titulo" className="text-2xl font-bold tracking-tight">{projeto.nome}</h2>
            {projeto.ano && <p className="mt-1 text-sm text-white/50">{projeto.ano}</p>}
          </div>
          <button
            type="button"
            onClick={onFechar}
            aria-label="Fechar"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-lg hover:bg-white/20"
          >
            ×
          </button>
        </div>

        {projeto.descricao && <p className="mt-6 leading-relaxed text-white/80">{projeto.descricao}</p>}

        {projeto.tecnologias.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/50">Tecnologias e IA</h3>
            <ul className="flex flex-wrap gap-2">
              {projeto.tecnologias.map((tecnologia) => (
                <li key={tecnologia} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm">
                  <TecnologiaIcon nome={tecnologia} />
                  {tecnologia}
                </li>
              ))}
            </ul>
          </div>
        )}

        {readme && (
          <div className="mt-6 rounded-2xl bg-white/5 p-5">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/50">README</h3>
            <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-white/80">
              {readmeLongo && !lendoTudo ? `${readme.slice(0, LIMITE_README).trimEnd()}…` : readme}
            </div>
            {readmeLongo && (
              <button
                type="button"
                onClick={() => setLendoTudo((atual) => !atual)}
                className="mt-4 text-sm font-medium text-[#ffab4a] hover:underline"
              >
                {lendoTudo ? 'Ler menos' : 'Ler mais...'}
              </button>
            )}
          </div>
        )}

        {projeto.link && (
          <a
            href={projeto.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex rounded-full bg-gradient-to-r from-[#ffab4a] to-[#ff4d8d] px-5 py-2.5 text-sm font-semibold text-[#0b0c10]"
          >
            Abrir projeto ↗
          </a>
        )}
      </div>
    </div>
  )
}
