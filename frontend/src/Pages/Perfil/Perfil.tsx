import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api, ApiError } from '../../services/api'
import type { Perfil as PerfilDados, Projeto } from '../../services/projetos'

function CardProjeto({ projeto, indice }: { projeto: Projeto; indice: number }) {
  const numero = String(indice + 1).padStart(2, '0')
  const conteudo = (
    <>
      <div className="relative aspect-[16/10] overflow-hidden bg-[#15161b]">
        {projeto.imagem ? (
          <img
            src={projeto.imagem}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1d1f27] to-[#07080a]">
            <span className="text-7xl font-black uppercase text-[#f4f1ea]/10">
              {projeto.nome.charAt(0)}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07080a] via-transparent to-transparent" />
        <span className="absolute left-4 top-4 font-mono text-xs text-[#f4f1ea]/70">{numero}</span>
        {projeto.link && (
          <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#f4f1ea] text-[#07080a] transition-transform duration-300 group-hover:rotate-45">
            ↗
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-2xl font-bold uppercase tracking-tight">{projeto.nome}</h3>
          {projeto.ano && <span className="shrink-0 text-sm text-[#f4f1ea]/50">{projeto.ano}</span>}
        </div>
        {projeto.descricao && (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[#f4f1ea]/65">{projeto.descricao}</p>
        )}
      </div>
    </>
  )

  const classe =
    'group flex h-full flex-col overflow-hidden border border-[#f4f1ea]/10 bg-[#0c0d12] transition-colors duration-500 hover:border-[#f4f1ea]/40'

  return projeto.link ? (
    <a href={projeto.link} target="_blank" rel="noopener noreferrer" className={classe}>
      {conteudo}
    </a>
  ) : (
    <div className={classe}>{conteudo}</div>
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
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#07080a] px-6 text-center text-[#f4f1ea]">
        <p role="alert" className="text-2xl font-bold uppercase">{erro}</p>
        <Link to="/" className="mt-6 text-sm uppercase tracking-widest text-[#f4f1ea]/60 hover:text-[#f4f1ea]">
          Voltar ao início
        </Link>
      </div>
    )
  }

  if (!perfil) {
    return <div className="min-h-[70vh] bg-[#07080a]" />
  }

  const anos = perfil.projetos.map((p) => p.ano).filter((a): a is number => a !== null)
  const primeiroAno = anos.length ? Math.min(...anos) : null
  const ultimoAno = anos.length ? Math.max(...anos) : null

  return (
    <div className="relative overflow-hidden bg-[#07080a] text-[#f4f1ea]">
      <div className="pointer-events-none absolute inset-0 bg-grade" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-grain opacity-[0.06]" aria-hidden="true" />

      <section className="relative px-6 pb-20 pt-28 sm:px-12 lg:px-20">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
            <div className="flex h-36 w-36 shrink-0 items-center justify-center rounded-full border border-[#f4f1ea]/20 bg-gradient-to-br from-[#2a2d38] to-[#07080a] text-6xl font-black shadow-[0_0_80px_-10px_rgba(255,170,60,0.35)]">
              {perfil.nome.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-mono text-sm uppercase tracking-[0.3em] text-[#f4f1ea]/50">@{perfil.username}</p>
              <h1 className="mt-2 text-[clamp(3rem,9vw,7rem)] font-black uppercase leading-[0.9] tracking-tighter">
                {perfil.nome}
              </h1>
            </div>
          </div>

          <dl className="grid grid-cols-3 gap-8 border-t border-[#f4f1ea]/15 pt-6 md:border-t-0 md:pt-0 md:text-right">
            <div>
              <dt className="text-xs uppercase tracking-widest text-[#f4f1ea]/50">Projetos</dt>
              <dd className="mt-1 text-4xl font-black">{perfil.projetos.length}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-widest text-[#f4f1ea]/50">Desde</dt>
              <dd className="mt-1 text-4xl font-black">{primeiroAno ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-widest text-[#f4f1ea]/50">Último</dt>
              <dd className="mt-1 text-4xl font-black">{ultimoAno ?? '—'}</dd>
            </div>
          </dl>
        </div>

        {perfil.bio && (
          <p className="mt-12 max-w-3xl text-[clamp(1.25rem,2.5vw,1.75rem)] font-light leading-snug tracking-tight text-[#f4f1ea]/85">
            {perfil.bio}
          </p>
        )}
      </section>

      <section className="relative px-6 pb-32 sm:px-12 lg:px-20">
        <div className="mb-10 flex items-end justify-between border-b border-[#f4f1ea]/15 pb-4">
          <h2 className="text-sm font-medium uppercase tracking-[0.4em] text-[#f4f1ea]/60">Projetos</h2>
          <span className="font-mono text-sm text-[#f4f1ea]/40">{String(perfil.projetos.length).padStart(2, '0')}</span>
        </div>

        {perfil.projetos.length === 0 ? (
          <p className="py-24 text-center text-lg text-[#f4f1ea]/50">Nenhum projeto publicado ainda.</p>
        ) : (
          <ul className="grid gap-px bg-[#f4f1ea]/10 md:grid-cols-2">
            {perfil.projetos.map((projeto, indice) => (
              <li key={projeto.id} className="flex bg-[#07080a]">
                <CardProjeto projeto={projeto} indice={indice} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer className="relative border-t border-[#f4f1ea]/15 px-6 py-8 text-center sm:px-12">
        <Link to="/" className="text-xs uppercase tracking-[0.4em] text-[#f4f1ea]/50 hover:text-[#f4f1ea]">
          Feito com Mirrorwork
        </Link>
      </footer>
    </div>
  )
}
