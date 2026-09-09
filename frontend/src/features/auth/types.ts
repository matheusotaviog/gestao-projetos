export interface LoginCredentials {
  email: string
  senha: string
}

export interface LoginResponse {
  mensagem: string
  token: string
}

export interface CadastroData {
  nome: string
  email: string
  senha: string
}

export interface UsuarioResponse {
  id: number
  nome: string
  email: string
}

export interface AuthState {
  token: string | null
  usuario: UsuarioResponse | null
}
