import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

type FormData = {
  nome: string
  email: string
  telefone: string
  senha: string
  confirmarSenha: string
}

const initialForm: FormData = {
  nome: '',
  email: '',
  telefone: '',
  senha: '',
  confirmarSenha: '',
}

function validar(form: FormData): string | null {
  if (!form.nome.trim()) return 'Informe seu nome.'
  if (!/^\S+@\S+\.\S+$/.test(form.email)) return 'Informe um e-mail válido.'
  if (form.senha.length < 6) return 'A senha precisa ter pelo menos 6 caracteres.'
  if (form.senha !== form.confirmarSenha) return 'As senhas não coincidem.'
  return null
}

const inputClass =
  'h-12 w-full rounded-xl border border-[#d2d2d7] bg-white px-4 text-base text-[#1d1d1f] placeholder:text-[#86868b] outline-none transition focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/20'

export function Cadastro() {
  const [form, setForm] = useState<FormData>(initialForm)
  const [erro, setErro] = useState<string | null>(null)
  const [sucesso, setSucesso] = useState(false)
  const [enviando, setEnviando] = useState(false)

  function atualizar(campo: keyof FormData, valor: string) {
    setForm((atual) => ({ ...atual, [campo]: valor }))
  }

  async function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSucesso(false)

    const erroDeValidacao = validar(form)
    if (erroDeValidacao) {
      setErro(erroDeValidacao)
      return
    }

    setErro(null)
    setEnviando(true)
    try {
      const resposta = await fetch(`${API_BASE_URL}/api/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: form.nome.trim(),
          email: form.email.trim(),
          telefone: form.telefone.trim() || null,
          senha: form.senha,
        }),
      })

      if (!resposta.ok) {
        setErro(await resposta.text())
        return
      }

      setForm(initialForm)
      setSucesso(true)
    } catch {
      setErro('Não foi possível conectar ao servidor. Verifique se o backend está rodando.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-center text-4xl font-semibold tracking-tight">
        Crie sua conta
      </h1>
      <p className="mt-3 text-center text-base text-[#1d1d1f]">
        Uma conta é tudo o que você precisa para organizar seus projetos.
      </p>
      <p className="mt-1 text-center text-sm text-[#6e6e73]">
        Já tem uma conta?{' '}
        <Link to="/login" className="text-[#0071e3] hover:underline">
          Entrar ›
        </Link>
      </p>

      <form onSubmit={enviar} noValidate className="mt-10 space-y-3">
        <label htmlFor="nome" className="sr-only">Nome</label>
        <input
          id="nome"
          className={inputClass}
          placeholder="Nome"
          value={form.nome}
          onChange={(e) => atualizar('nome', e.target.value)}
        />

        <label htmlFor="email" className="sr-only">E-mail</label>
        <input
          id="email"
          type="email"
          className={inputClass}
          placeholder="nome@exemplo.com"
          value={form.email}
          onChange={(e) => atualizar('email', e.target.value)}
        />

        <label htmlFor="telefone" className="sr-only">Telefone</label>
        <input
          id="telefone"
          type="tel"
          className={inputClass}
          placeholder="Telefone (opcional)"
          value={form.telefone}
          onChange={(e) => atualizar('telefone', e.target.value)}
        />

        <label htmlFor="senha" className="sr-only">Senha</label>
        <input
          id="senha"
          type="password"
          className={inputClass}
          placeholder="Senha"
          value={form.senha}
          onChange={(e) => atualizar('senha', e.target.value)}
        />

        <label htmlFor="confirmarSenha" className="sr-only">Confirmar senha</label>
        <input
          id="confirmarSenha"
          type="password"
          className={inputClass}
          placeholder="Confirmar senha"
          value={form.confirmarSenha}
          onChange={(e) => atualizar('confirmarSenha', e.target.value)}
        />

        {erro && (
          <p role="alert" className="pt-2 text-sm text-[#d70015]">
            {erro}
          </p>
        )}
        {sucesso && (
          <p role="status" className="pt-2 text-sm text-[#248a3d]">
            Conta criada com sucesso.
          </p>
        )}

        <button
          type="submit"
          disabled={enviando}
          className="mt-6 h-12 w-full rounded-xl bg-[#0071e3] text-base font-medium text-white transition-colors hover:bg-[#0077ed] disabled:opacity-50"
        >
          {enviando ? 'Enviando...' : 'Continuar'}
        </button>
      </form>

      <p className="mt-8 text-center text-xs leading-relaxed text-[#6e6e73]">
        Os seus dados são usados para identificar sua conta e salvar seus
        projetos, tarefas e cronograma.
      </p>
    </section>
  )
}
