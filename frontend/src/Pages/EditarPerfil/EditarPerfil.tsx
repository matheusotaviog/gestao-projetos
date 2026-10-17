import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../Context/AuthContext'
import { enviarAvatar, obterMeuPerfil, salvarPerfil, urlAvatar, type PerfilPessoal } from '../../services/perfil'
import { buscarProfissoes } from '../../services/usuarios'
import { Skeleton } from '../../components/Skeleton/Skeleton'

const campo =
  'h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#ffab4a]/60 focus:ring-4 focus:ring-[#ffab4a]/10'
const rotulo = 'mb-2 block text-xs font-medium uppercase tracking-widest text-white/50'

export function EditarPerfil() {
  const { token, username, logout } = useAuth()
  const navigate = useNavigate()
  const inputFoto = useRef<HTMLInputElement>(null)
  const [perfil, setPerfil] = useState<PerfilPessoal | null>(null)
  const [profissoes, setProfissoes] = useState<string[]>([])
  const [salvando, setSalvando] = useState(false)
  const [enviandoFoto, setEnviandoFoto] = useState(false)
  const [mensagem, setMensagem] = useState<{ tipo: 'ok' | 'erro'; texto: string } | null>(null)

  useEffect(() => {
    if (!token) return
    obterMeuPerfil(token).then(setPerfil).catch(() => setMensagem({ tipo: 'erro', texto: 'Não foi possível carregar seu perfil.' }))
  }, [token])

  useEffect(() => {
    buscarProfissoes()
      .then(setProfissoes)
      .catch(() => setMensagem({ tipo: 'erro', texto: 'Não foi possível carregar a lista de profissões. Atualize a página.' }))
  }, [])

  function atualizar<K extends keyof PerfilPessoal>(campoAlterado: K, valor: PerfilPessoal[K]) {
    setPerfil((atual) => (atual ? { ...atual, [campoAlterado]: valor } : atual))
  }

  async function salvar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    if (!token || !perfil) return
    setSalvando(true)
    setMensagem(null)
    try {
      const atualizado = await salvarPerfil(token, {
        nome: perfil.nome,
        bio: perfil.bio,
        profissao: perfil.profissao,
        cidade: perfil.cidade,
        empresa: perfil.empresa,
        github: perfil.github,
        linkedin: perfil.linkedin,
        site: perfil.site,
      })
      setPerfil(atualizado)
      setMensagem({ tipo: 'ok', texto: 'Perfil salvo.' })
    } catch (e) {
      setMensagem({ tipo: 'erro', texto: e instanceof Error ? e.message : 'Não foi possível salvar.' })
    } finally {
      setSalvando(false)
    }
  }

  async function trocarFoto(arquivo: File | undefined) {
    if (!token || !arquivo) return
    setEnviandoFoto(true)
    setMensagem(null)
    try {
      setPerfil(await enviarAvatar(token, arquivo))
      setMensagem({ tipo: 'ok', texto: 'Foto atualizada.' })
    } catch (e) {
      setMensagem({ tipo: 'erro', texto: e instanceof Error ? e.message : 'Não foi possível enviar a foto.' })
    } finally {
      setEnviandoFoto(false)
      if (inputFoto.current) inputFoto.current.value = ''
    }
  }

  if (!perfil) {
    return (
      <section role="status" aria-label="Carregando perfil" className="mx-auto max-w-2xl space-y-6 px-6 py-12">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-28 w-28 rounded-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-12 w-full" />
      </section>
    )
  }

  const avatar = urlAvatar(perfil.avatar)
  const ehGestor = perfil.papel === 'GESTOR'
  const ehRecrutador = perfil.papel === 'RECRUTADOR'

  return (
    <div className="min-h-screen bg-[#0b0c10] text-white">
      <section className="mx-auto max-w-2xl px-6 py-12">
        <Link to={`/perfil/${username}`} className="text-sm text-white/60 transition-colors hover:text-white">‹ Voltar ao perfil</Link>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight">Editar perfil</h1>

        <div className="mt-10 flex items-center gap-6">
          <button
            type="button"
            onClick={() => inputFoto.current?.click()}
            disabled={enviandoFoto}
            aria-label="Trocar foto"
            className="group relative h-28 w-28 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-[#ffab4a] to-[#ff4d8d] p-[3px] disabled:opacity-60"
          >
            <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-[#0b0c10] text-4xl font-black">
              {avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : perfil.nome.charAt(0).toUpperCase()}
            </span>
            <span className="absolute inset-0 flex items-center justify-center bg-black/60 text-xs font-medium opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {enviandoFoto ? 'Enviando...' : 'Trocar foto'}
            </span>
          </button>
          <div>
            <p className="font-semibold">{perfil.nome}</p>
            <p className="text-sm text-[#ffab4a]">@{perfil.username}</p>
            <p className="mt-2 text-xs text-white/40">JPG, PNG ou WEBP, até 5 MB</p>
          </div>
          <input
            ref={inputFoto}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => trocarFoto(e.target.files?.[0])}
          />
        </div>

        <form onSubmit={salvar} className="mt-10 space-y-6">
          <div>
            <label htmlFor="nome" className={rotulo}>Nome</label>
            <input id="nome" className={campo} value={perfil.nome} onChange={(e) => atualizar('nome', e.target.value)} />
          </div>

          {ehGestor && (
            <div>
              <label htmlFor="profissao" className={rotulo}>Profissão</label>
              <select id="profissao" className={`${campo} [&>option]:bg-[#15161c]`} value={perfil.profissao ?? ''} onChange={(e) => atualizar('profissao', e.target.value || null)}>
                <option value="" className="bg-[#15161c] text-white">Escolha sua profissão</option>
                {profissoes.map((p) => (
                  <option key={p} value={p} className="bg-[#15161c] text-white">{p}</option>
                ))}
              </select>
            </div>
          )}

          {ehRecrutador && (
            <div>
              <label htmlFor="empresa" className={rotulo}>Empresa</label>
              <input id="empresa" className={campo} placeholder="Onde você trabalha" value={perfil.empresa ?? ''} onChange={(e) => atualizar('empresa', e.target.value || null)} />
            </div>
          )}

          <div>
            <label htmlFor="cidade" className={rotulo}>Cidade</label>
            <input id="cidade" className={campo} placeholder="Ex.: Fortaleza, CE" value={perfil.cidade ?? ''} onChange={(e) => atualizar('cidade', e.target.value || null)} />
          </div>

          <div>
            <label htmlFor="bio" className={rotulo}>Sobre você</label>
            <textarea
              id="bio"
              rows={4}
              maxLength={500}
              className={`${campo} h-auto py-3`}
              placeholder="Conte quem você é, o que gosta de construir e o que procura."
              value={perfil.bio ?? ''}
              onChange={(e) => atualizar('bio', e.target.value || null)}
            />
            <p className="mt-1 text-right text-xs text-white/40">{(perfil.bio ?? '').length}/500</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="github" className={rotulo}>GitHub</label>
              <input id="github" type="url" className={campo} placeholder="https://github.com/..." value={perfil.github ?? ''} onChange={(e) => atualizar('github', e.target.value || null)} />
            </div>
            <div>
              <label htmlFor="linkedin" className={rotulo}>LinkedIn</label>
              <input id="linkedin" type="url" className={campo} placeholder="https://linkedin.com/in/..." value={perfil.linkedin ?? ''} onChange={(e) => atualizar('linkedin', e.target.value || null)} />
            </div>
          </div>

          <div>
            <label htmlFor="site" className={rotulo}>Site ou portfólio</label>
            <input id="site" type="url" className={campo} placeholder="https://..." value={perfil.site ?? ''} onChange={(e) => atualizar('site', e.target.value || null)} />
          </div>

          {mensagem && (
            <p role={mensagem.tipo === 'erro' ? 'alert' : 'status'} className={`text-sm ${mensagem.tipo === 'erro' ? 'text-red-400' : 'text-emerald-400'}`}>
              {mensagem.texto}
            </p>
          )}

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <button
              type="submit"
              disabled={salvando}
              className="h-12 flex-1 rounded-full bg-gradient-to-r from-[#ffab4a] to-[#ff4d8d] text-sm font-semibold text-[#0b0c10] transition-opacity disabled:opacity-50"
            >
              {salvando ? 'Salvando...' : 'Salvar alterações'}
            </button>
            <button
              type="button"
              onClick={() => { logout(); navigate('/login', { replace: true }) }}
              className="h-12 rounded-full border border-white/15 px-6 text-sm font-medium text-white/70 transition-colors hover:bg-white/5"
            >
              Sair
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
