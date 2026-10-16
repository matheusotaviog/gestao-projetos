import { useEffect, useState, type FormEvent } from 'react'
import { buscarTecnologias, type GrupoTecnologias, type ProjetoForm as Dados } from '../../services/projetos'
import { TecnologiasPicker } from '../TecnologiasPicker/TecnologiasPicker'

type Props = {
  inicial?: Dados
  textoBotao: string
  onSalvar: (dados: Dados, arquivo: File | null) => Promise<void>
  onCancelar?: () => void
}

const vazio: Dados = { nome: '', descricao: '', link: '', ano: null, readme: '', tecnologias: [] }

const inputClass =
  'h-12 w-full rounded-xl border border-[#d2d2d7] bg-white px-4 text-base text-[#1d1d1f] placeholder:text-[#86868b] outline-none transition focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/20'

export function ProjetoForm({ inicial = vazio, textoBotao, onSalvar, onCancelar }: Props) {
  const [dados, setDados] = useState<Dados>(inicial)
  const [erro, setErro] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [arquivo, setArquivo] = useState<File | null>(null)
  const [grupos, setGrupos] = useState<GrupoTecnologias[]>([])

  useEffect(() => {
    buscarTecnologias().then(setGrupos).catch(() => setErro('Não foi possível carregar as tecnologias.'))
  }, [])

  async function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!dados.nome.trim()) {
      setErro('Informe o nome do projeto.')
      return
    }
    setErro(null)
    setEnviando(true)
    try {
      await onSalvar({ ...dados, nome: dados.nome.trim(), link: dados.link.trim() }, arquivo)
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível salvar o projeto.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={enviar} noValidate className="space-y-3 rounded-3xl bg-white p-6 shadow-sm">
      <label htmlFor="projeto-nome" className="sr-only">Nome do projeto</label>
      <input
        id="projeto-nome"
        className={inputClass}
        placeholder="Nome do projeto"
        value={dados.nome}
        onChange={(e) => setDados({ ...dados, nome: e.target.value })}
      />

      <label htmlFor="projeto-link" className="sr-only">Link do projeto</label>
      <input
        id="projeto-link"
        type="url"
        className={inputClass}
        placeholder="Link do projeto (https://...)"
        value={dados.link}
        onChange={(e) => setDados({ ...dados, link: e.target.value })}
      />

      <label htmlFor="projeto-ano" className="sr-only">Ano</label>
      <input
        id="projeto-ano"
        type="number"
        className={inputClass}
        placeholder="Ano (ex.: 2026)"
        value={dados.ano ?? ''}
        onChange={(e) => setDados({ ...dados, ano: e.target.value ? Number(e.target.value) : null })}
      />

      <label className="block">
        <span className="mb-2 block text-sm text-[#86868b]">Imagem de capa (JPG, PNG ou WEBP, até 5 MB)</span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => setArquivo(e.target.files?.[0] ?? null)}
          className="block w-full text-sm text-[#86868b] file:mr-4 file:rounded-full file:border-0 file:bg-[#f5f5f7] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[#1d1d1f]"
        />
      </label>

      <label htmlFor="projeto-descricao" className="sr-only">Descrição</label>
      <textarea
        id="projeto-descricao"
        rows={3}
        className={`${inputClass} h-auto py-3`}
        placeholder="Descrição do projeto"
        value={dados.descricao}
        onChange={(e) => setDados({ ...dados, descricao: e.target.value })}
      />

      <label htmlFor="projeto-readme" className="sr-only">README</label>
      <textarea
        id="projeto-readme"
        rows={8}
        className={`${inputClass} h-auto py-3 font-mono text-sm`}
        placeholder="README: como o projeto funciona, o que foi feito, próximos passos"
        value={dados.readme}
        onChange={(e) => setDados({ ...dados, readme: e.target.value })}
      />

      <div className="pt-2">
        <p className="mb-3 text-sm font-medium text-[#1d1d1f]">Tecnologias e IA usadas</p>
        <TecnologiasPicker
          grupos={grupos}
          selecionadas={dados.tecnologias}
          onChange={(tecnologias) => setDados({ ...dados, tecnologias })}
        />
      </div>

      {erro && <p role="alert" className="text-sm text-[#d70015]">{erro}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={enviando}
          className="h-11 rounded-xl bg-[#0071e3] px-5 text-sm font-medium text-white transition-colors hover:bg-[#0077ed] disabled:opacity-50"
        >
          {enviando ? 'Salvando...' : textoBotao}
        </button>
        {onCancelar && (
          <button
            type="button"
            onClick={onCancelar}
            className="h-11 rounded-xl px-5 text-sm font-medium text-[#0071e3] hover:underline"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}
