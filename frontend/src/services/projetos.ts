import { API_BASE_URL } from './api'

export type Projeto = {
  id: number
  nome: string
  descricao: string | null
  link: string | null
  ano: number | null
  imagem: string | null
  readme: string | null
  tecnologias: string[]
}

export type ProjetoForm = {
  nome: string
  descricao: string
  link: string
  ano: number | null
  readme: string
  tecnologias: string[]
}

export type GrupoTecnologias = {
  titulo: string
  itens: string[]
}

export type Perfil = {
  username: string
  nome: string
  profissao: string | null
  bio: string | null
  avatar: string | null
  cidade: string | null
  empresa: string | null
  github: string | null
  linkedin: string | null
  site: string | null
  projetos: Projeto[]
}

export function urlImagem(imagem: string | null): string | null {
  if (!imagem) return null
  return imagem.startsWith('/') ? `${API_BASE_URL}${imagem}` : imagem
}

export async function enviarImagem(id: number, arquivo: File, token: string): Promise<Projeto> {
  const corpo = new FormData()
  corpo.append('arquivo', arquivo)
  const resposta = await fetch(`${API_BASE_URL}/api/projetos/${id}/imagem`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: corpo,
  })
  if (!resposta.ok) {
    throw new Error((await resposta.text()) || 'Não foi possível enviar a imagem.')
  }
  return (await resposta.json()) as Projeto
}

export async function buscarTecnologias(): Promise<GrupoTecnologias[]> {
  const resposta = await fetch(`${API_BASE_URL}/api/tecnologias`)
  if (!resposta.ok) {
    throw new Error('Não foi possível carregar as tecnologias.')
  }
  return (await resposta.json()) as GrupoTecnologias[]
}
