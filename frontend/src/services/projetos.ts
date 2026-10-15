export type Projeto = {
  id: number
  nome: string
  descricao: string | null
  link: string | null
  ano: number | null
  imagem: string | null
}

export type ProjetoForm = {
  nome: string
  descricao: string
  link: string
  ano: number | null
}

export type Perfil = {
  username: string
  nome: string
  bio: string | null
  projetos: Projeto[]
}
