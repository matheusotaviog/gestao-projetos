import { createContext, useCallback, useContext, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { api } from '../../services/api'
import { useAuth } from '../../Context/AuthContext'

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
  const fimRef = useRef<HTMLDivElement>(null)

  const podeConversar = !!token && (papel === 'GESTOR' || papel === 'RECRUTADOR')

  const carregarConversas = useCallback(() => {
    if (!token) return Promise.resolve()
    return api<Conversa[]>('/api/chat/conversas', { token }).then(setConversas).catch(() => undefined)
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

  return (
    <ChatContext.Provider value={{ abrirCom }}>
      {children}
      {podeConversar && (
        <div className="fixed bottom-0 right-6 z-40 w-80 text-white">
          {!aberto ? (
            <button
              type="button"
              onClick={() => setAberto(true)}
              className="flex w-full items-center gap-3 rounded-t-xl border border-b-0 border-white/10 bg-[#1b1d23] px-4 py-2.5 shadow-2xl"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#ffab4a] to-[#ff4d8d] text-sm font-bold text-[#0b0c10]">
                {iniciais(papel === 'GESTOR' ? 'G' : 'R')}
              </span>
              <span className="flex-1 text-left text-sm font-semibold">Mensagens</span>
              <span aria-hidden="true">^</span>
            </button>
          ) : (
            <div className="flex h-[32rem] flex-col overflow-hidden rounded-t-xl border border-b-0 border-white/10 bg-[#1b1d23] shadow-2xl">
              {ativa ? (
                <>
                  <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
                    <button type="button" onClick={() => { setAtiva(null); setMensagens([]) }} aria-label="Voltar" className="text-white/70 hover:text-white">‹</button>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{ativa.outroNome}</p>
                      {ativa.outroProfissao && <p className="truncate text-xs text-white/50">{ativa.outroProfissao}</p>}
                    </div>
                    <button type="button" onClick={() => setAberto(false)} aria-label="Minimizar" className="text-white/70 hover:text-white">⌄</button>
                  </div>

                  <div className="flex-1 space-y-2 overflow-y-auto px-4 py-3">
                    {mensagens.length === 0 && <p className="pt-8 text-center text-sm text-white/40">Diga oi para começar a conversa.</p>}
                    {mensagens.map((m) => (
                      <div key={m.id} className={`flex ${m.minha ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${m.minha ? 'bg-[#0a66c2] text-white' : 'bg-white/10 text-white'}`}>
                          {m.texto}
                          <p className="mt-1 text-right text-[10px] text-white/50">{m.criadaEm}</p>
                        </div>
                      </div>
                    ))}
                    <div ref={fimRef} />
                  </div>

                  <form onSubmit={enviar} className="flex gap-2 border-t border-white/10 p-3">
                    <input
                      value={texto}
                      onChange={(e) => setTexto(e.target.value)}
                      maxLength={2000}
                      placeholder="Escreva uma mensagem"
                      aria-label="Mensagem"
                      className="h-10 flex-1 rounded-full bg-white/10 px-4 text-sm text-white outline-none placeholder:text-white/40"
                    />
                    <button type="submit" disabled={!texto.trim()} className="rounded-full bg-[#0a66c2] px-4 text-sm font-semibold disabled:opacity-40">
                      Enviar
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#ffab4a] to-[#ff4d8d] text-sm font-bold text-[#0b0c10]">
                      {iniciais(papel === 'GESTOR' ? 'G' : 'R')}
                    </span>
                    <p className="flex-1 text-sm font-semibold">Mensagens</p>
                    <button type="button" onClick={() => setAberto(false)} aria-label="Minimizar" className="text-white/70 hover:text-white">⌄</button>
                  </div>
                  {erro && <p role="alert" className="px-4 pt-3 text-sm text-red-400">{erro}</p>}
                  <div className="flex-1 overflow-y-auto">
                    {conversas.length === 0 && (
                      <p className="px-4 py-8 text-center text-sm text-white/40">
                        {papel === 'RECRUTADOR' ? 'Abra o perfil de um candidato e clique em "Enviar mensagem".' : 'Quando um recrutador falar com você, a conversa aparece aqui.'}
                      </p>
                    )}
                    {conversas.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setAtiva(c)}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-white/5"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 font-semibold">
                          {iniciais(c.outroNome)}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-baseline justify-between gap-2">
                            <span className="truncate text-sm font-semibold">{c.outroNome}</span>
                            {c.ultimaEm && <span className="shrink-0 text-[11px] text-white/40">{c.ultimaEm}</span>}
                          </span>
                          <span className="block truncate text-xs text-white/50">{c.ultimaMensagem ?? 'Sem mensagens ainda'}</span>
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
