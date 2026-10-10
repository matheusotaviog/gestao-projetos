import { describe, it, expect, beforeEach } from 'vitest'
import { projectService } from '../services/projectService'
import { taskService } from '../../tasks/services/taskService'

describe('projectService (RF02)', () => {
  beforeEach(() => {
    projectService.resetMock()
  })

  it('lista projetos com contagem de tarefas', async () => {
    const projetos = await projectService.listar()
    expect(projetos.length).toBe(2)

    const proj1 = projetos.find((p) => p.id === 1)
    expect(proj1).toBeDefined()
    expect(proj1?.totalTarefas).toBe(2)
  })

  it('cria um novo projeto com sucesso', async () => {
    const novo = await projectService.criar({
      nome: 'Engenharia de Software',
      descricao: 'Metodologias ágeis, Clean Architecture e testes unitários.',
    })

    expect(novo.id).toBeDefined()
    expect(novo.nome).toBe('Engenharia de Software')
    expect(novo.totalTarefas).toBe(0)

    const todos = await projectService.listar()
    expect(todos.some((p) => p.id === novo.id)).toBe(true)
  })

  it('rejeita criação com nome vazio ou menor que 2 caracteres', async () => {
    await expect(projectService.criar({ nome: ' ' })).rejects.toThrow(
      'O nome do projeto é obrigatório.',
    )
    await expect(projectService.criar({ nome: 'A' })).rejects.toThrow(
      'O nome do projeto deve ter pelo menos 2 caracteres.',
    )
  })

  it('atualiza nome e descrição de um projeto existente', async () => {
    const atualizado = await projectService.atualizar(1, {
      nome: 'Algoritmos Avançados',
      descricao: 'Nova descrição atualizada.',
    })

    expect(atualizado.nome).toBe('Algoritmos Avançados')
    expect(atualizado.descricao).toBe('Nova descrição atualizada.')
  })

  it('exclui projeto e remove em cascata as tarefas associadas', async () => {
    await projectService.excluir(1)

    const projetos = await projectService.listar()
    expect(projetos.some((p) => p.id === 1)).toBe(false)

    const tarefasProjeto1 = await taskService.listarPorProjeto(1)
    expect(tarefasProjeto1.length).toBe(0)
  })
})
