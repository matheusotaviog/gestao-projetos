import type { GrupoTecnologias } from '../../services/projetos'

type Props = {
  grupos: GrupoTecnologias[]
  selecionadas: string[]
  onChange: (tecnologias: string[]) => void
}

export function TecnologiasPicker({ grupos, selecionadas, onChange }: Props) {
  function alternar(item: string) {
    onChange(
      selecionadas.includes(item)
        ? selecionadas.filter((atual) => atual !== item)
        : [...selecionadas, item],
    )
  }

  return (
    <div className="space-y-5">
      {grupos.map((grupo) => (
        <div key={grupo.titulo}>
          <p className="mb-2 text-sm font-medium text-[#86868b]">{grupo.titulo}</p>
          <div className="flex flex-wrap gap-2">
            {grupo.itens.map((item) => {
              const ativa = selecionadas.includes(item)
              return (
                <button
                  key={item}
                  type="button"
                  aria-pressed={ativa}
                  onClick={() => alternar(item)}
                  className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                    ativa
                      ? 'border-[#0071e3] bg-[#0071e3] text-white'
                      : 'border-[#d2d2d7] bg-white text-[#1d1d1f] hover:border-[#0071e3]'
                  }`}
                >
                  {item}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
