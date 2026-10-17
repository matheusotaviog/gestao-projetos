import { useEffect, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api, ApiError } from '../../services/api'
import { useAuth } from '../../Context/AuthContext'
import type { Perfil } from '../../services/projetos'

const campo =
  'h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#ffab4a]/60 focus:ring-4 focus:ring-[#ffab4a]/10'

export function Contato() {
  const { username } = useParams()
  const { token } = useAuth()
  const [perfil, setPerfil] = useState<Perfil | null>(null)
  const [erroPerfil, setErroPerfil] = useState<string | null>(null)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [enviado, setEnviado] = useState(false)

  useEffect(() => {
    api<Perfil>(`/api/perfis/${username}`)
      .then(setPerfil)
      .catch((e: unknown) => setErroPerfil(e instanceof ApiError && e.status === 404 ? 'Perfil não encontrado.' : 'Não foi possível carregar o perfil.'))
  }, [username])

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    if (!token || !username) return
    setErro(null)
    setEnviando(true)
    try {
      await api(`/api/candidatos/${username}/contato`, {
        method: 'POST',
        body: { nome: nome.trim(), email: email.trim(), mensagem: mensagem.trim() },
        token,
      })
      setEnviado(true)
      setMensagem('')
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível enviar a mensagem.')
    } finally {
      setEnviando(false)
    }
  }

  if (erroPerfil) {
    return <p role="alert" className="bg-[#0b0c10] px-6 py-16 text-white">{erroPerfil}</p>
  }

  return (
    <div className="min-h-screen bg-[#0b0c10] text-white">
      <section className="mx-auto max-w-2xl px-6 py-12">
        <Link to={`/perfil/${username}`} className="text-sm text-white/60 hover:text-white">‹ Voltar ao perfil</Link>

        <h1 className="mt-6 text-4xl font-semibold tracking-tight">
          Entre em contato com {perfil?.nome ?? '...'}
        </h1>
        <p className="mt-3 text-base text-white/60">
          Conte quem você é e o que procura. A resposta vai direto para o seu e-mail.
        </p>

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Agendar uma call</h2>
              <p className="mt-1 text-sm text-white/50">Escolha um horário para conversar por vídeo.</p>
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/60">Em breve</span>
          </div>
          <div className="mt-6 grid grid-cols-7 gap-2 opacity-40" aria-hidden="true">
            {Array.from({ length: 14 }, (_, i) => (
              <div key={i} className="flex h-10 items-center justify-center rounded-lg border border-white/10 text-xs">
                {(i % 7) + 9}h
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={enviar} noValidate className="mt-6 space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-lg font-semibold">Enviar uma mensagem</h2>

          <label htmlFor="contato-nome" className="sr-only">Seu nome</label>
          <input id="contato-nome" className={campo} placeholder="Seu nome" value={nome} onChange={(e) => setNome(e.target.value)} />

          <label htmlFor="contato-email" className="sr-only">Seu e-mail para resposta</label>
          <input
            id="contato-email"
            type="email"
            className={campo}
            placeholder="Seu e-mail (corporativo ou pessoal)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="contato-mensagem" className="sr-only">Mensagem</label>
          <textarea
            id="contato-mensagem"
            rows={6}
            maxLength={2000}
            className={`${campo} h-auto py-3`}
            placeholder="Fale sobre a vaga ou a oportunidade..."
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
          />
          <p className="text-right text-xs text-white/40">{mensagem.length}/2000</p>

          {erro && <p role="alert" className="text-sm text-red-400">{erro}</p>}
          {enviado && <p role="status" className="text-sm text-emerald-400">Mensagem enviada. O candidato responde direto no seu e-mail.</p>}

          <button
            type="submit"
            disabled={enviando}
            className="h-12 w-full rounded-full bg-gradient-to-r from-[#ffab4a] to-[#ff4d8d] text-sm font-semibold text-[#0b0c10] disabled:opacity-50"
          >
            {enviando ? 'Enviando...' : 'Enviar mensagem'}
          </button>
        </form>
      </section>
    </div>
  )
}
