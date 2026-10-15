import { createContext, useContext, useState, type ReactNode } from 'react'

const TOKEN_KEY = 'token'
const USERNAME_KEY = 'username'

type AuthContextValue = {
  token: string | null
  username: string | null
  login: (token: string, username: string | null) => void
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => ler(TOKEN_KEY))
  const [username, setUsername] = useState<string | null>(() => ler(USERNAME_KEY))

  function login(novoToken: string, novoUsername: string | null) {
    localStorage.setItem(TOKEN_KEY, novoToken)
    if (novoUsername) {
      localStorage.setItem(USERNAME_KEY, novoUsername)
    } else {
      localStorage.removeItem(USERNAME_KEY)
    }
    setToken(novoToken)
    setUsername(novoUsername)
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USERNAME_KEY)
    setToken(null)
    setUsername(null)
  }

  return (
    <AuthContext.Provider value={{ token, username, login, logout }}>
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
