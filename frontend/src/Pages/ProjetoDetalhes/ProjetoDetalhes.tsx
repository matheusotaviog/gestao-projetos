import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api, ApiError } from '../../services/api'
import { useAuth } from '../../Context/AuthContext'
import { ProjetoForm } from '../../components/ProjetoForm/ProjetoForm'
import { TecnologiaIcon } from '../../components/TecnologiasPicker/TecnologiaIcon'
import { enviarImagem, urlImagem, type Projeto, type ProjetoForm as Dados } from '../../services/projetos'

export function ProjetoDetalhes() {
  const { projetoId } = useParams()
  const { token } = useAuth()
  const navigate = useNavigate()
  const [projeto, setProjeto] = useState<Projeto | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [editando, setEditando] = useState(false)

  useEffect(() => {
    api<Projeto>(`/api/projetos/${projetoId}`, { token })
      .then(setProjeto)
      .catch((e: unknown) => {
        setErro(e instanceof ApiError && e.status === 403
          ? 'Você não tem permissão para ver este projeto.'
          : 'Projeto não encontrado.')
      })
  }, [projetoId, token])

  async function salvar(dados: Dados, arquivo: File | null) {
    const atualizado = await api<Projeto>(`/api/projetos/${projetoId}`, {
      method: 'PUT',
      body: dados,
      token,
    })
    const comImagem = arquivo && token ? await enviarImagem(atualizado.id, arquivo, token) : atualizado
    setProjeto(comImagem)
    setEditando(false)
  }

  async function excluir() {
    if (!window.confirm('Excluir este projeto? Essa ação não pode ser desfeita.')) return
    await api(`/api/projetos/${projetoId}`, { method: 'DELETE', token })
    navigate('/projetos', { replace: true })
  }

  if (erro) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-16">
        <p role="alert">{erro}</p>
        <Link to="/projetos" className="mt-4 inline-block text-[#0071e3] hover:underline">‹ Voltar para meus projetos</Link>
      </section>
    )
  }

  if (!projeto) {
    return <p className="mx-auto max-w-3xl px-6 py-16">Carregando...</p>
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-12">
      <Link to="/projetos" className="text-sm text-[#0071e3] hover:underline">‹ Meus projetos</Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">{projeto.nome}</h1>
          {projeto.ano && <p className="mt-2 text-sm text-[#6e6e73]">{projeto.ano}</p>}
        </div>
        {!editando && (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setEditando(true)}
              className="h-10 rounded-full bg-white px-4 text-sm font-medium shadow-sm hover:shadow-md"
            >
              Editar
            </button>
            <button
              type="button"
              onClick={excluir}
              className="h-10 rounded-full bg-white px-4 text-sm font-medium text-[#d70015] shadow-sm hover:shadow-md"
            >
              Excluir
            </button>
          </div>
        )}
      </div>

      {editando ? (
        <div className="mt-8">
          <ProjetoForm
            inicial={{
              nome: projeto.nome,
              descricao: projeto.descricao ?? '',
              link: projeto.link ?? '',
              ano: projeto.ano,
              readme: projeto.readme ?? '',
              tecnologias: projeto.tecnologias,
            }}
            textoBotao="Salvar alterações"
            onSalvar={salvar}
            onCancelar={() => setEditando(false)}
          />
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          {projeto.imagem && (
            <img src={urlImagem(projeto.imagem) ?? undefined} alt="" className="w-full rounded-3xl object-cover" />
          )}
          {projeto.descricao && <p className="text-lg leading-relaxed text-[#1d1d1f]">{projeto.descricao}</p>}
          {projeto.link && (
            <a
              href={projeto.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full bg-[#0071e3] px-6 py-3 text-base font-medium text-white hover:bg-[#0077ed]"
            >
              Abrir projeto ↗
            </a>
          )}
          {projeto.tecnologias.length > 0 && (
            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#6e6e73]">Tecnologias e IA</h2>
              <ul className="flex flex-wrap gap-2">
                {projeto.tecnologias.map((tecnologia) => (
                  <li key={tecnologia} className="inline-flex items-center gap-2 rounded-full bg-[#f5f5f7] px-3 py-1.5 text-sm text-[#1d1d1f]">
                    <TecnologiaIcon nome={tecnologia} />
                    {tecnologia}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {projeto.readme && (
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#6e6e73]">README</h2>
              <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-[#1d1d1f]">{projeto.readme}</div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
