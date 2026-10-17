import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../Context/AuthContext'
import { buscarTecnologias, type GrupoTecnologias } from '../../services/projetos'
import { buscarCandidatos, buscarProfissoes, listarTecnologiasPlanas, type Candidato } from '../../services/usuarios'
import { TecnologiaIcon } from '../../components/TecnologiasPicker/TecnologiaIcon'
import { SkeletonCandidatos } from '../../components/Skeleton/Skeleton'

const campo =
  'h-11 w-full rounded-xl border border-[#d2d2d7] bg-white px-4 text-sm text-[#1d1d1f] outline-none transition focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/20'

export function Candidatos() {
  const { token } = useAuth()
  const [busca, setBusca] = useState('')
  const [tecnologia, setTecnologia] = useState('')
  const [profissao, setProfissao] = useState('')
  const [tecnologias, setTecnologias] = useState<string[]>([])
  const [profissoes, setProfissoes] = useState<string[]>([])
  const [candidatos, setCandidatos] = useState<Candidato[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    buscarTecnologias()
      .then((grupos: GrupoTecnologias[]) => setTecnologias(listarTecnologiasPlanas(grupos)))
      .catch(() => setErro('Não foi possível carregar as tecnologias.'))
    buscarProfissoes().then(setProfissoes).catch(() => setErro('Não foi possível carregar as profissões.'))
  }, [])

  useEffect(() => {
    if (!token) return
    const pausa = setTimeout(() => {
      setCarregando(true)
      buscarCandidatos(token, { busca, tecnologia, profissao })
        .then(setCandidatos)
        .catch(() => setErro('Não foi possível buscar candidatos.'))
        .finally(() => setCarregando(false))
    }, 250)
    return () => clearTimeout(pausa)
  }, [token, busca, tecnologia, profissao])

  const filtrosAtivos = busca || tecnologia || profissao

  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-4xl font-semibold tracking-tight">Candidatos</h1>
      <p className="mt-2 text-base text-[#6e6e73]">Encontre talentos pelos projetos que eles publicam.</p>

      <div className="mt-8 grid gap-3 rounded-2xl bg-white p-4 shadow-sm sm:grid-cols-4">
        <input
          className={campo}
          placeholder="Nome ou @usuário"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          aria-label="Buscar por nome ou usuário"
        />
        <select className={campo} value={profissao} onChange={(e) => setProfissao(e.target.value)} aria-label="Profissão">
          <option value="">Todas as profissões</option>
          {profissoes.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <select className={campo} value={tecnologia} onChange={(e) => setTecnologia(e.target.value)} aria-label="Tecnologia">
          <option value="">Todas as tecnologias</option>
          {tecnologias.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <button
          type="button"
          disabled={!filtrosAtivos}
          onClick={() => {
            setBusca('')
            setTecnologia('')
            setProfissao('')
          }}
          className="h-11 rounded-xl text-sm font-medium text-[#0071e3] hover:underline disabled:invisible"
        >
          Limpar filtros
        </button>
      </div>

      {erro && <p role="alert" className="mt-6 text-sm text-[#d70015]">{erro}</p>}
      {carregando && <SkeletonCandidatos />}

      {!carregando && candidatos.length === 0 && (
        <p className="mt-12 text-center text-[#6e6e73]">Nenhum candidato encontrado com esses filtros.</p>
      )}

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {candidatos.map((candidato) => (
          <li key={candidato.username}>
            <Link
              to={`/perfil/${candidato.username}`}
              className="flex h-full flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#ffab4a] to-[#ff4d8d] text-lg font-bold text-[#0b0c10]">
                  {candidato.nome.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-[#1d1d1f]">{candidato.nome}</p>
                  <p className="truncate text-sm text-[#6e6e73]">@{candidato.username}</p>
                </div>
              </div>

              {candidato.profissao && <p className="text-sm font-medium text-[#1d1d1f]">{candidato.profissao}</p>}

              {candidato.tecnologias.length > 0 && (
                <ul className="flex flex-wrap gap-2">
                  {candidato.tecnologias.slice(0, 6).map((t) => (
                    <li key={t} className="inline-flex items-center gap-1.5 rounded-full bg-[#f5f5f7] px-2.5 py-1 text-xs text-[#1d1d1f]">
                      <TecnologiaIcon nome={t} tamanho={12} />
                      {t}
                    </li>
                  ))}
                  {candidato.tecnologias.length > 6 && (
                    <li className="px-1 py-1 text-xs text-[#6e6e73]">+{candidato.tecnologias.length - 6}</li>
                  )}
                </ul>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
