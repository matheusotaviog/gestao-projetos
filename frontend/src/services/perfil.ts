import { API_BASE_URL, api } from './api'
import type { Papel } from './usuarios'

export type PerfilPessoal = {
  username: string
  nome: string
  email: string
  papel: Papel
  bio: string | null
  profissao: string | null
  avatar: string | null
  cidade: string | null
  empresa: string | null
  github: string | null
  linkedin: string | null
  site: string | null
}

export type PerfilEdicao = Omit<PerfilPessoal, 'username' | 'email' | 'papel' | 'avatar'>

export function obterMeuPerfil(token: string): Promise<PerfilPessoal> {
  return api<PerfilPessoal>('/api/perfil', { token })
}

export function salvarPerfil(token: string, dados: PerfilEdicao): Promise<PerfilPessoal> {
  return api<PerfilPessoal>('/api/perfil', { method: 'PUT', body: dados, token })
}

export async function enviarAvatar(token: string, arquivo: File): Promise<PerfilPessoal> {
  const corpo = new FormData()
  corpo.append('arquivo', arquivo)
  const resposta = await fetch(`${API_BASE_URL}/api/perfil/avatar`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: corpo,
  })
  if (!resposta.ok) throw new Error((await resposta.text()) || 'Não foi possível enviar a foto.')
  return (await resposta.json()) as PerfilPessoal
}

export function urlAvatar(avatar: string | null): string | null {
  if (!avatar) return null
  return avatar.startsWith('/') ? `${API_BASE_URL}${avatar}` : avatar
}
