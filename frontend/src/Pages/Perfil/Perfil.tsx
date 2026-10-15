import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api, ApiError } from '../../services/api'
import type { Perfil as PerfilDados, Projeto } from '../../services/projetos'

function CardProjeto({ projeto }: { projeto: Projeto }) {
  const conteudo = (
    <>
      <div className="aspect-video bg-gradient-to-br from-[#e8e8ed] to-[#d2d2d7]">
        {projeto.imagem && (
          <img src={projeto.imagem} alt="" loading="lazy" className="h-full w-full object-cover" />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">{projeto.nome}</h2>
          {projeto.ano && (
            <span className="rounded-full bg-[#f5f5f7] px-2.5 py-0.5 text-xs text-[#6e6e73]">{projeto.ano}</span>
          )}
        </div>
        {projeto.descricao && <p className="mt-2 line-clamp-2 text-sm text-[#6e6e73]">{projeto.descricao}</p>}
        {projeto.link && (
          <span className="mt-auto block pt-4">
            <span className="block rounded-xl border border-[#d2d2d7] py-2 text-center text-sm font-medium">
              Ver projeto ↗
            </span>
          </span>
        )}
      </div>
    </>
  )

  const classe = 'flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-sm transition-shadow hover:shadow-md'

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
    return <p role="alert" className="mx-auto max-w-5xl px-6 py-16">{erro}</p>
  }

  if (!perfil) {
    return <p className="mx-auto max-w-5xl px-6 py-16">Carregando...</p>
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <header className="flex flex-col items-center text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#1d1d1f] text-3xl font-semibold text-white">
          {perfil.nome.charAt(0).toUpperCase()}
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">{perfil.nome}</h1>
        <p className="mt-1 text-sm text-[#6e6e73]">@{perfil.username}</p>
        {perfil.bio && <p className="mt-4 max-w-xl text-base leading-relaxed text-[#1d1d1f]">{perfil.bio}</p>}
      </header>

      {perfil.projetos.length === 0 ? (
        <p className="mt-12 text-center text-[#6e6e73]">Nenhum projeto publicado ainda.</p>
      ) : (
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {perfil.projetos.map((projeto) => (
            <li key={projeto.id}>
              <CardProjeto projeto={projeto} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
