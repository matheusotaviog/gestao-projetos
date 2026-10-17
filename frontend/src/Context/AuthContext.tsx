import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Papel } from '../services/usuarios'

const TOKEN_KEY = 'token'
const USERNAME_KEY = 'username'
const PAPEL_KEY = 'papel'

type AuthContextValue = {
  token: string | null
  username: string | null
  papel: Papel | null
  login: (token: string, username: string | null, papel: Papel | null) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function ler(chave: string): string | null {
  try {
    return localStorage.getItem(chave)
  } catch {
    return null
  }
}

function guardar(chave: string, valor: string | null) {
  if (valor) {
    localStorage.setItem(chave, valor)
  } else {
    localStorage.removeItem(chave)
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => ler(TOKEN_KEY))
  const [username, setUsername] = useState<string | null>(() => ler(USERNAME_KEY))
  const [papel, setPapel] = useState<Papel | null>(() => ler(PAPEL_KEY) as Papel | null)

  function login(novoToken: string, novoUsername: string | null, novoPapel: Papel | null) {
    guardar(TOKEN_KEY, novoToken)
    guardar(USERNAME_KEY, novoUsername)
    guardar(PAPEL_KEY, novoPapel)
    setToken(novoToken)
    setUsername(novoUsername)
    setPapel(novoPapel)
  }

  function logout() {
    guardar(TOKEN_KEY, null)
    guardar(USERNAME_KEY, null)
    guardar(PAPEL_KEY, null)
    setToken(null)
    setUsername(null)
    setPapel(null)
  }

  return (
    <AuthContext.Provider value={{ token, username, papel, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const contexto = useContext(AuthContext)
  if (!contexto) {
    throw new Error('useAuth precisa estar dentro de AuthProvider')
  }
  return contexto
}
