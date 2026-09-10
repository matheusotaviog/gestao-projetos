import type {
  CadastroData,
  LoginCredentials,
  LoginResponse,
  UsuarioResponse,
} from '../types'

const TOKEN_KEY = 'gestao_projetos_token'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = 'Ocorreu um erro ao processar a solicitação.'
    try {
      const errorData = await response.json()
      if (errorData.message) {
        errorMessage = errorData.message
      } else if (errorData.mensagem) {
        errorMessage = errorData.mensagem
      } else if (typeof errorData === 'string') {
        errorMessage = errorData
      }
    } catch {
      if (response.status === 401 || response.status === 403) {
        errorMessage = 'Credenciais inválidas. Verifique seu e-mail e senha.'
      } else if (response.status === 404) {
        errorMessage = 'Recurso não encontrado.'
      } else if (response.status >= 500) {
        errorMessage = 'Erro interno no servidor. Tente novamente mais tarde.'
      }
    }
    throw new Error(errorMessage)
  }

  return response.json() as Promise<T>
}

export const authService = {
  async cadastrar(dados: CadastroData): Promise<UsuarioResponse> {
    const response = await fetch(`${API_BASE_URL}/usuarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dados),
    })

    return handleResponse<UsuarioResponse>(response)
  },

  async login(credenciais: LoginCredentials): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/usuarios/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credenciais),
    })

    const data = await handleResponse<LoginResponse>(response)
    if (data.token) {
      this.setToken(data.token)
    }
    return data
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  },

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token)
  },

  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY)
  },

  isAuthenticated(): boolean {
    return Boolean(this.getToken())
  },
}
