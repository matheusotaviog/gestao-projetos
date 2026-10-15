export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

type Opcoes = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: unknown
  token?: string | null
}

export async function api<T>(caminho: string, { method = 'GET', body, token }: Opcoes = {}): Promise<T> {
  const headers: Record<string, string> = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers['Authorization'] = `Bearer ${token}`

  const resposta = await fetch(`${API_BASE_URL}${caminho}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  if (!resposta.ok) {
    throw new ApiError(resposta.status, (await resposta.text()) || 'Erro inesperado.')
  }

  if (resposta.status === 204) {
    return undefined as T
  }
  return (await resposta.json()) as T
}
