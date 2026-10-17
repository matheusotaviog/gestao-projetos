import { createContext, useCallback, useContext, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { api } from '../../services/api'
import { useAuth } from '../../Context/AuthContext'
import { IconeChevronBaixo, IconeChevronCima, IconeEnviar, IconeMensagem, IconeNovaMensagem, IconeVoltar } from './ChatIcons'

type Conversa = {
  id: number
  outroNome: string
  outroUsername: string
  outroProfissao: string | null
  ultimaMensagem: string | null
  ultimaEm: string | null
}

type Mensagem = {
  id: number
  minha: boolean
  texto: string
  criadaEm: string
}

type ChatContextValue = {
  abrirCom: (username: string) => Promise<void>
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined)

export function useChat() {
  const contexto = useContext(ChatContext)
  if (!contexto) throw new Error('useChat precisa estar dentro de ChatProvider')
  return contexto
}

function iniciais(nome: string) {
  return nome.charAt(0).toUpperCase()
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const { token, papel } = useAuth()
  const [aberto, setAberto] = useState(false)
  const [conversas, setConversas] = useState<Conversa[]>([])
  const [ativa, setAtiva] = useState<Conversa | null>(null)
  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  const [texto, setTexto] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [carregandoConversas, setCarregandoConversas] = useState(true)
  const fimRef = useRef<HTMLDivElement>(null)

  const podeConversar = !!token && (papel === 'GESTOR' || papel === 'RECRUTADOR')

  const carregarConversas = useCallback(() => {
    if (!token) return Promise.resolve()
    return api<Conversa[]>('/api/chat/conversas', { token })
      .then(setConversas)
      .catch(() => undefined)
      .finally(() => setCarregandoConversas(false))
  }, [token])

  const carregarMensagens = useCallback((id: number) => {
    if (!token) return Promise.resolve()
    return api<Mensagem[]>(`/api/chat/conversas/${id}/mensagens`, { token }).then(setMensagens).catch(() => undefined)
  }, [token])

  useEffect(() => {
    if (!podeConversar || !aberto || ativa) return
    carregarConversas()
    const timer = setInterval(carregarConversas, 5000)
    return () => clearInterval(timer)
  }, [podeConversar, aberto, ativa, carregarConversas])

  useEffect(() => {
    if (!ativa) return
    carregarMensagens(ativa.id)
    const timer = setInterval(() => carregarMensagens(ativa.id), 4000)
    return () => clearInterval(timer)
  }, [ativa, carregarMensagens])

  useEffect(() => {
    fimRef.current?.scrollIntoView({ block: 'end' })
  }, [mensagens])

  const abrirCom = useCallback(async (username: string) => {
    if (!token) return
    setErro(null)
    try {
      const conversa = await api<Conversa>('/api/chat/conversas', { method: 'POST', body: { username }, token })
      setAtiva(conversa)
      setAberto(true)
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível abrir a conversa.')
      setAberto(true)
    }
  }, [token])

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    if (!ativa || !token || !texto.trim()) return
    const conteudo = texto.trim()
    setTexto('')
    try {
      await api(`/api/chat/conversas/${ativa.id}/mensagens`, { method: 'POST', body: { texto: conteudo }, token })
      await carregarMensagens(ativa.id)
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível enviar.')
      setTexto(conteudo)
    }
  }

  const avatarProprio = (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#ffab4a] to-[#ff4d8d] text-sm font-bold text-[#0b0c10] shadow-[0_0_20px_-4px_rgba(255,120,80,0.6)]">
      {papel === 'GESTOR' ? 'G' : 'R'}
    </span>
  )

  const botaoIcone = 'flex h-8 w-8 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white'

  return (
    <ChatContext.Provider value={{ abrirCom }}>
      {children}
      {podeConversar && (
        <div className="fixed bottom-0 right-6 z-40 w-[22rem] font-sans text-white">
          {!aberto ? (
            <button
              type="button"
              onClick={() => setAberto(true)}
              className="flex w-full items-center gap-3 rounded-t-2xl border border-b-0 border-white/10 bg-[#15161c]/95 px-4 py-3 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-colors hover:bg-[#1b1d25]"
            >
              {avatarProprio}
              <span className="flex-1 text-left text-sm font-semibold tracking-tight">Mensagens</span>
              <IconeChevronCima className="h-4 w-4 text-white/60" />
            </button>
          ) : (
            <div className="animate-slide-up flex h-[34rem] flex-col overflow-hidden rounded-t-2xl border border-b-0 border-white/10 bg-[#15161c] shadow-[0_-10px_50px_-10px_rgba(0,0,0,0.7)]">
              {ativa ? (
                <>
                  <div className="flex items-center gap-2 border-b border-white/10 px-3 py-3">
                    <button type="button" onClick={() => { setAtiva(null); setMensagens([]) }} aria-label="Voltar" className={botaoIcone}>
                      <IconeVoltar className="h-4 w-4" />
                    </button>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-semibold">
                      {iniciais(ativa.outroNome)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{ativa.outroNome}</p>
                      {ativa.outroProfissao && <p className="truncate text-xs text-white/50">{ativa.outroProfissao}</p>}
                    </div>
                    <button type="button" onClick={() => setAberto(false)} aria-label="Minimizar" className={botaoIcone}>
                      <IconeChevronBaixo className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                    {mensagens.length === 0 && (
                      <div className="flex flex-col items-center gap-2 pt-12 text-center">
                        <IconeMensagem className="h-10 w-10 text-white/20" />
                        <p className="text-sm text-white/50">Diga oi para começar a conversa.</p>
                      </div>
                    )}
                    {mensagens.map((m) => (
                      <div key={m.id} className={`flex ${m.minha ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm leading-relaxed shadow-sm ${
                            m.minha
                              ? 'rounded-br-md bg-gradient-to-br from-[#ffab4a] to-[#ff4d8d] text-[#0b0c10]'
                              : 'rounded-bl-md bg-white/10 text-white'
                          }`}
                        >
                          {m.texto}
                          <p className={`mt-1 text-right text-[10px] ${m.minha ? 'text-[#0b0c10]/60' : 'text-white/40'}`}>{m.criadaEm}</p>
                        </div>
                      </div>
                    ))}
                    <div ref={fimRef} />
                  </div>

                  <form onSubmit={enviar} className="flex items-center gap-2 border-t border-white/10 p-3">
                    <input
                      value={texto}
                      onChange={(e) => setTexto(e.target.value)}
                      maxLength={2000}
                      placeholder="Escreva uma mensagem..."
                      aria-label="Mensagem"
                      className="h-10 flex-1 rounded-full border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#ffab4a]/50"
                    />
                    <button
                      type="submit"
                      disabled={!texto.trim()}
                      aria-label="Enviar"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#ffab4a] to-[#ff4d8d] text-[#0b0c10] transition-opacity disabled:opacity-30"
                    >
                      <IconeEnviar className="h-4 w-4" />
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
                    {avatarProprio}
                    <p className="flex-1 text-sm font-semibold tracking-tight">Mensagens</p>
                    <button type="button" aria-label="Nova mensagem" className={botaoIcone} title="Escolha um candidato no perfil dele">
                      <IconeNovaMensagem className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => setAberto(false)} aria-label="Minimizar" className={botaoIcone}>
                      <IconeChevronBaixo className="h-4 w-4" />
                    </button>
                  </div>
                  {erro && <p role="alert" className="px-4 pt-3 text-sm text-red-400">{erro}</p>}
                  <div className="flex-1 overflow-y-auto py-1">
                    {carregandoConversas && (
                      <div role="status" aria-label="Carregando conversas" className="space-y-4 px-4 py-4">
                        {[0, 1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-white/10" />
                            <div className="flex-1 space-y-2">
                              <div className="h-3 w-1/2 animate-pulse rounded bg-white/10" />
                              <div className="h-3 w-4/5 animate-pulse rounded bg-white/5" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {!carregandoConversas && conversas.length === 0 && (
                      <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
                        <IconeMensagem className="h-10 w-10 text-white/20" />
                        <p className="text-sm text-white/50">
                          {papel === 'RECRUTADOR'
                            ? 'Abra o perfil de um candidato e clique em "Enviar mensagem".'
                            : 'Quando um recrutador falar com você, a conversa aparece aqui.'}
                        </p>
                      </div>
                    )}
                    {conversas.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setAtiva(c)}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/5"
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-white/15 to-white/5 font-semibold">
                          {iniciais(c.outroNome)}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-baseline justify-between gap-2">
                            <span className="truncate text-sm font-semibold">{c.outroNome}</span>
                            {c.ultimaEm && <span className="shrink-0 text-[11px] text-white/40">{c.ultimaEm}</span>}
                          </span>
                          <span className="mt-0.5 block truncate text-xs text-white/50">{c.ultimaMensagem ?? 'Sem mensagens ainda'}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </ChatContext.Provider>
  )
}
