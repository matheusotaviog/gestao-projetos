import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../Context/AuthContext'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const inputClass =
  'h-12 w-full rounded-xl border border-[#d2d2d7] bg-white px-4 text-base text-[#1d1d1f] placeholder:text-[#86868b] outline-none transition focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/20'

export function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  async function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErro(null)
    setEnviando(true)

    try {
      const resposta = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), senha }),
      })

      if (!resposta.ok) {
        setErro(await resposta.text())
        return
      }

      const dados: { token: string; username: string | null } = await resposta.json()
      login(dados.token, dados.username)
      navigate('/', { replace: true })
    } catch {
      setErro('Não foi possível conectar ao servidor. Verifique se o backend está rodando.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-center text-4xl font-semibold tracking-tight">Entrar</h1>
      <p className="mt-3 text-center text-base text-[#1d1d1f]">
        Use o e-mail e a senha da sua conta.
      </p>
      <p className="mt-1 text-center text-sm text-[#6e6e73]">
        Não tem uma conta?{' '}
        <Link to="/cadastro" className="text-[#0071e3] hover:underline">
          Criar conta ›
        </Link>
      </p>

      <form onSubmit={enviar} noValidate className="mt-10 space-y-3">
        <label htmlFor="email" className="sr-only">E-mail</label>
        <input
          id="email"
          type="email"
          className={inputClass}
          placeholder="nome@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="senha" className="sr-only">Senha</label>
        <input
          id="senha"
          type="password"
          className={inputClass}
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        {erro && (
          <p role="alert" className="pt-2 text-sm text-[#d70015]">
            {erro}
          </p>
        )}

        <button
          type="submit"
          disabled={enviando}
          className="mt-6 h-12 w-full rounded-xl bg-[#0071e3] text-base font-medium text-white transition-colors hover:bg-[#0077ed] disabled:opacity-50"
        >
          {enviando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </section>
  )
}
