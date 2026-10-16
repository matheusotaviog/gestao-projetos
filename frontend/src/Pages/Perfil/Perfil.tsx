import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api, ApiError } from '../../services/api'
import type { Perfil as PerfilDados, Projeto } from '../../services/projetos'

function CardProjeto({ projeto }: { projeto: Projeto }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-colors duration-300 hover:border-white/25">
      <div className="aspect-[16/10] overflow-hidden bg-white/5">
        {projeto.imagem ? (
          <img src={projeto.imagem} alt="" loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl font-semibold text-white/20">
            {projeto.nome.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-lg font-semibold">{projeto.nome}</h3>
          {projeto.ano && <span className="text-sm text-white/50">{projeto.ano}</span>}
        </div>
        {projeto.descricao && (
          <p className="line-clamp-3 text-sm leading-relaxed text-white/60">{projeto.descricao}</p>
        )}
        {projeto.link && (
          <a
            href={projeto.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-medium text-[#0b0c10] transition-opacity hover:opacity-85"
          >
            Ver projeto ↗
          </a>
        )}
      </div>
    </article>
  )
}

export function Perfil() {
  const { username } = useParams()
  const [perfil, setPerfil] = useState<PerfilDados | null>(null)
  const [erro, setErro] = useState<string | null>(null)

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
    return <div className="min-h-[70vh] bg-[#0b0c10]" />
  }

  const anos = perfil.projetos.map((p) => p.ano).filter((a): a is number => a !== null)
  const primeiroAno = anos.length ? Math.min(...anos) : null
  const ultimoAno = anos.length ? Math.max(...anos) : null

  return (
    <div className="min-h-screen bg-[#0b0c10] text-white">
      <section className="mx-auto max-w-5xl px-6 pb-12 pt-16">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
          <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-white/10 text-4xl font-semibold">
            {perfil.nome.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h1 className="text-3xl font-semibold tracking-tight">{perfil.nome}</h1>
            <p className="mt-1 text-sm text-white/50">@{perfil.username}</p>

            <dl className="mt-5 flex gap-8 text-sm">
              <div>
                <dt className="sr-only">Projetos</dt>
                <dd><span className="font-semibold">{perfil.projetos.length}</span> <span className="text-white/50">projetos</span></dd>
              </div>
              {primeiroAno && (
                <div>
                  <dt className="sr-only">Período</dt>
                  <dd><span className="font-semibold">{primeiroAno}</span>{ultimoAno !== primeiroAno && <span className="font-semibold"> – {ultimoAno}</span>} <span className="text-white/50">de atuação</span></dd>
                </div>
              )}
            </dl>

            {perfil.bio && <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80">{perfil.bio}</p>}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24">
        <h2 className="mb-6 border-t border-white/10 pt-8 text-sm font-medium text-white/60">Projetos</h2>

        {perfil.projetos.length === 0 ? (
          <p className="py-16 text-center text-white/50">Nenhum projeto publicado ainda.</p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {perfil.projetos.map((projeto) => (
              <li key={projeto.id} className="flex">
                <CardProjeto projeto={projeto} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center">
        <Link to="/" className="text-xs text-white/40 hover:text-white/70">Feito com Mirrorwork</Link>
      </footer>
    </div>
  )
}
