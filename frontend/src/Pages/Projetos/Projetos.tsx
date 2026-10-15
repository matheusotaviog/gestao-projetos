import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../services/api'
import { useAuth } from '../../Context/AuthContext'
import { ProjetoForm } from '../../components/ProjetoForm/ProjetoForm'
import type { Projeto, ProjetoForm as Dados } from '../../services/projetos'

export function Projetos() {
  const { token } = useAuth()
  const [projetos, setProjetos] = useState<Projeto[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [criando, setCriando] = useState(false)

  useEffect(() => {
    api<Projeto[]>('/api/projetos/meus', { token })
      .then(setProjetos)
      .catch(() => setErro('Não foi possível carregar seus projetos.'))
      .finally(() => setCarregando(false))
  }, [token])

  async function criar(dados: Dados) {
    const novo = await api<Projeto>('/api/projetos', { method: 'POST', body: dados, token })
    setProjetos((atual) => [novo, ...atual])
    setCriando(false)
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">Meus Projetos</h1>
          <p className="mt-2 text-base text-[#6e6e73]">Crie, acompanhe e edite os seus projetos.</p>
        </div>
        {!criando && (
          <button
            type="button"
            onClick={() => setCriando(true)}
            className="h-11 rounded-full bg-[#0071e3] px-5 text-sm font-medium text-white hover:bg-[#0077ed]"
          >
            Novo projeto
          </button>
        )}
      </div>

      {criando && (
        <div className="mt-8 max-w-xl">
          <ProjetoForm textoBotao="Criar projeto" onSalvar={criar} onCancelar={() => setCriando(false)} />
        </div>
      )}

      {erro && <p role="alert" className="mt-8 text-sm text-[#d70015]">{erro}</p>}
      {carregando && <p className="mt-8">Carregando...</p>}

      {!carregando && projetos.length === 0 && !criando && (
        <p className="mt-8">Você ainda não tem projetos. Clique em "Novo projeto" para começar.</p>
      )}

      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projetos.map((projeto) => (
          <li key={projeto.id}>
            <Link
              to={`/projetos/${projeto.id}`}
              className="flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="aspect-video bg-gradient-to-br from-[#e8e8ed] to-[#d2d2d7]">
                {projeto.imagem && (
                  <img src={projeto.imagem} alt="" loading="lazy" className="h-full w-full object-cover" />
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold">{projeto.nome}</h2>
                  {projeto.ano && (
                    <span className="rounded-full bg-[#f5f5f7] px-2.5 py-0.5 text-xs text-[#6e6e73]">{projeto.ano}</span>
                  )}
                </div>
                {projeto.descricao && (
                  <p className="mt-2 line-clamp-2 text-sm text-[#6e6e73]">{projeto.descricao}</p>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
