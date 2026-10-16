import { useEffect, useMemo, useRef, useState } from 'react'
import type { GrupoTecnologias } from '../../services/projetos'
import { TecnologiaIcon } from './TecnologiaIcon'

type Props = {
  grupos: GrupoTecnologias[]
  selecionadas: string[]
  onChange: (tecnologias: string[]) => void
}

export function TecnologiasPicker({ grupos, selecionadas, onChange }: Props) {
  const [aberto, setAberto] = useState(false)
  const [busca, setBusca] = useState('')
  const raiz = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!aberto) return

    function fecharAoClicarFora(evento: MouseEvent) {
      if (raiz.current && !raiz.current.contains(evento.target as Node)) {
        setAberto(false)
      }
    }
    function fecharComEscape(evento: KeyboardEvent) {
      if (evento.key === 'Escape') setAberto(false)
    }

    document.addEventListener('mousedown', fecharAoClicarFora)
    document.addEventListener('keydown', fecharComEscape)
    return () => {
      document.removeEventListener('mousedown', fecharAoClicarFora)
      document.removeEventListener('keydown', fecharComEscape)
    }
  }, [aberto])

  const gruposFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return grupos
      .map((grupo) => ({
        ...grupo,
        itens: grupo.itens.filter((item) => item.toLowerCase().includes(termo)),
      }))
      .filter((grupo) => grupo.itens.length > 0)
  }, [grupos, busca])

  function alternar(item: string) {
    onChange(
      selecionadas.includes(item)
        ? selecionadas.filter((atual) => atual !== item)
        : [...selecionadas, item],
    )
  }

  return (
    <div ref={raiz} className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {selecionadas.map((item) => (
          <span
            key={item}
            className="inline-flex items-center gap-2 rounded-full border border-[#d2d2d7] bg-white py-1.5 pl-3 pr-1.5 text-sm text-[#1d1d1f]"
          >
            <TecnologiaIcon nome={item} />
            {item}
            <button
              type="button"
              onClick={() => alternar(item)}
              aria-label={`Remover ${item}`}
              className="flex h-5 w-5 items-center justify-center rounded-full text-[#86868b] hover:bg-[#f5f5f7] hover:text-[#1d1d1f]"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      <div className="relative">
        <button
          type="button"
          aria-expanded={aberto}
          onClick={() => setAberto((atual) => !atual)}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#d2d2d7] bg-white px-4 text-sm font-medium text-[#1d1d1f] shadow-sm transition-colors hover:bg-[#f5f5f7]"
        >
          <span className="text-base leading-none">+</span>
          Adicionar tecnologia
        </button>

        {aberto && (
          <div className="absolute left-0 z-20 mt-2 w-80 overflow-hidden rounded-2xl border border-[#d2d2d7] bg-white shadow-xl">
            <div className="border-b border-[#e8e8ed] p-3">
              <input
                autoFocus
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar tecnologia..."
                className="h-9 w-full rounded-lg bg-[#f5f5f7] px-3 text-sm text-[#1d1d1f] outline-none placeholder:text-[#86868b] focus:ring-2 focus:ring-[#0071e3]/30"
              />
            </div>

            <div className="max-h-80 overflow-y-auto p-2">
              {gruposFiltrados.length === 0 && (
                <p className="px-3 py-6 text-center text-sm text-[#86868b]">Nenhuma tecnologia encontrada.</p>
              )}
              {gruposFiltrados.map((grupo) => (
                <div key={grupo.titulo} className="mb-2">
                  <p className="px-3 py-2 text-xs font-medium uppercase tracking-wide text-[#86868b]">{grupo.titulo}</p>
                  {grupo.itens.map((item) => {
                    const marcada = selecionadas.includes(item)
                    return (
                      <button
                        key={item}
                        type="button"
                        role="option"
                        aria-selected={marcada}
                        onClick={() => alternar(item)}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-[#1d1d1f] transition-colors hover:bg-[#f5f5f7]"
                      >
                        <TecnologiaIcon nome={item} />
                        <span className="flex-1">{item}</span>
                        {marcada && <span className="text-[#0071e3]">✓</span>}
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selecionadas.length === 0 && (
        <p className="text-sm text-[#86868b]">Nenhuma tecnologia escolhida ainda.</p>
      )}
    </div>
  )
}
