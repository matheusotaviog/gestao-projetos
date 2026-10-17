import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api, ApiError } from '../../services/api'
import { urlImagem, type Perfil as PerfilDados, type Projeto } from '../../services/projetos'
import { ProjetoModal } from '../../components/ProjetoModal/ProjetoModal'
import { SkeletonPerfil } from '../../components/Skeleton/Skeleton'
import { useChat } from '../../components/Chat/ChatWidget'
import { useAuth } from '../../Context/AuthContext'

function tomDoNome(nome: string): number {
  return [...nome].reduce((soma, letra) => soma + letra.charCodeAt(0), 0) % 360
}

function TileProjeto({ projeto, onDetalhes }: { projeto: Projeto; onDetalhes: () => void }) {
  const tom = tomDoNome(projeto.nome)
  return (
    <div className="group relative aspect-square overflow-hidden bg-[#15161b]">
      {projeto.imagem ? (
        <img
          src={urlImagem(projeto.imagem) ?? undefined}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center text-6xl font-black text-white/90"
          style={{ background: `linear-gradient(135deg, hsl(${tom} 85% 55%), hsl(${(tom + 60) % 360} 80% 25%))` }}
        >
          {projeto.nome.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/70 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 focus-within:opacity-100">
        <p className="text-center text-base font-semibold leading-tight">{projeto.nome}</p>
        <div className="flex flex-wrap justify-center gap-2">
          {projeto.link && (
            <a
              href={projeto.link}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white px-4 py-2 text-sm font-medium text-[#0b0c10] hover:opacity-90"
            >
              Abrir projeto ↗
            </a>
          )}
          <button
            type="button"
            onClick={onDetalhes}
            className="rounded-full border border-white/60 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
          >
            Detalhes
          </button>
        </div>
      </div>
    </div>
  )
}

export function Perfil() {
  const { username } = useParams()
  const { papel } = useAuth()
  const { abrirCom } = useChat()
  const [perfil, setPerfil] = useState<PerfilDados | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [selecionado, setSelecionado] = useState<Projeto | null>(null)

  useEffect(() => {
    api<PerfilDados>(`/api/perfis/${username}`)
      .then(setPerfil)
      .catch((e: unknown) => {
        setErro(e instanceof ApiError && e.status === 404 ? 'Perfil não encontrado.' : 'Não foi possível carregar o perfil.')
      })
  }, [username])

  if (erro) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-[#0b0c10] px-6 text-center text-white">
        <p role="alert" className="text-xl font-medium">{erro}</p>
        <Link to="/" className="text-sm text-white/60 hover:text-white">Voltar ao início</Link>
      </div>
    )
  }

  if (!perfil) {
    return <div className="min-h-[70vh] bg-[#0b0c10] px-6"><SkeletonPerfil /></div>
  }

  const anos = perfil.projetos.map((p) => p.ano).filter((a): a is number => a !== null)
  const primeiroAno = anos.length ? Math.min(...anos) : null
  const ultimoAno = anos.length ? Math.max(...anos) : null

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0c10] text-white">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[32rem]"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 60% 70% at 15% 0%, rgba(255,171,74,0.22), transparent 70%), radial-gradient(ellipse 50% 60% at 90% 10%, rgba(255,77,141,0.16), transparent 70%)',
        }}
      />
      <section className="relative mx-auto max-w-5xl px-6 pb-12 pt-16">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
          <div className="rounded-full bg-gradient-to-br from-[#ffab4a] to-[#ff4d8d] p-[3px] shadow-[0_0_50px_-10px_rgba(255,120,80,0.6)]">
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#0b0c10] text-4xl font-black">
              {perfil.nome.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="min-w-0">
            <h1 className="text-4xl font-bold tracking-tight">{perfil.nome}</h1>
            {papel === 'RECRUTADOR' && (
              <button
                type="button"
                onClick={() => abrirCom(perfil.username)}
                className="mt-4 inline-block rounded-full bg-gradient-to-r from-[#ffab4a] to-[#ff4d8d] px-5 py-2 text-sm font-semibold text-[#0b0c10]"
              >
                Enviar mensagem
              </button>
            )}
            <p className="mt-1 text-sm font-medium text-[#ffab4a]">@{perfil.username}</p>

            <dl className="mt-5 flex gap-8 text-sm">
              <div>
                <dt className="sr-only">Projetos</dt>
                <dd><span className="bg-gradient-to-r from-[#ffab4a] to-[#ff4d8d] bg-clip-text font-bold text-transparent">{perfil.projetos.length}</span> <span className="text-white/50">projetos</span></dd>
              </div>
              {primeiroAno && (
                <div>
                  <dt className="sr-only">Período</dt>
                  <dd><span className="bg-gradient-to-r from-[#ffab4a] to-[#ff4d8d] bg-clip-text font-bold text-transparent">{primeiroAno}</span>{ultimoAno !== primeiroAno && <span className="bg-gradient-to-r from-[#ffab4a] to-[#ff4d8d] bg-clip-text font-bold text-transparent"> – {ultimoAno}</span>} <span className="text-white/50">de atuação</span></dd>
                </div>
              )}
            </dl>

            {perfil.bio && <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80">{perfil.bio}</p>}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-24">
        <h2 className="mb-6 border-t border-white/10 pt-8 text-sm font-semibold uppercase tracking-widest text-[#ffab4a]">Projetos</h2>

        {perfil.projetos.length === 0 ? (
          <p className="py-16 text-center text-white/50">Nenhum projeto publicado ainda.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-1 sm:grid-cols-3">
            {perfil.projetos.map((projeto) => (
              <li key={projeto.id}>
                <TileProjeto projeto={projeto} onDetalhes={() => setSelecionado(projeto)} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {selecionado && <ProjetoModal projeto={selecionado} onFechar={() => setSelecionado(null)} />}
    </div>
  )
}
