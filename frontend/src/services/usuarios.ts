import { API_BASE_URL, api } from './api'
import type { GrupoTecnologias } from './projetos'

export type Papel = 'ADMIN' | 'GESTOR' | 'RECRUTADOR'

export type Candidato = {
  username: string
  nome: string
  profissao: string | null
  avatar: string | null
  tecnologias: string[]
}

export type UsuarioAdmin = {
  id: number
  nome: string
  email: string
  username: string | null
  papel: Papel
  profissao: string | null
}

export async function buscarProfissoes(): Promise<string[]> {
  const resposta = await fetch(`${API_BASE_URL}/api/profissoes`)
  if (!resposta.ok) throw new Error('Não foi possível carregar as profissões.')
  return (await resposta.json()) as string[]
}

export function listarTecnologiasPlanas(grupos: GrupoTecnologias[]): string[] {
  return grupos.flatMap((grupo) => grupo.itens)
}

export function buscarCandidatos(
  token: string,
  filtros: { busca: string; tecnologia: string; profissao: string },
): Promise<Candidato[]> {
  const params = new URLSearchParams()
  if (filtros.busca) params.set('busca', filtros.busca)
  if (filtros.tecnologia) params.set('tecnologia', filtros.tecnologia)
  if (filtros.profissao) params.set('profissao', filtros.profissao)
  const query = params.toString()
  return api<Candidato[]>(`/api/candidatos${query ? `?${query}` : ''}`, { token })
}

export function listarUsuarios(token: string): Promise<UsuarioAdmin[]> {
  return api<UsuarioAdmin[]>('/api/admin/usuarios', { token })
}

export function alterarPapel(token: string, id: number, papel: Papel): Promise<UsuarioAdmin> {
  return api<UsuarioAdmin>(`/api/admin/usuarios/${id}/papel`, { method: 'PATCH', body: { papel }, token })
}

export function removerUsuario(token: string, id: number): Promise<void> {
  return api<void>(`/api/admin/usuarios/${id}`, { method: 'DELETE', token })
}
