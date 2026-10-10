import { describe, it, expect, beforeEach } from 'vitest'
import { taskService } from '../services/taskService'

describe('taskService', () => {
  beforeEach(() => {
    taskService.resetMock()
  })

  it('lista todas as tarefas iniciais', async () => {
    const tarefas = await taskService.listarTodas()
    expect(tarefas.length).toBeGreaterThanOrEqual(4)
    expect(tarefas.some((t) => t.titulo.includes('busca binária'))).toBe(true)
  })

  it('lista tarefas filtradas por projeto', async () => {
    const tarefasProjeto1 = await taskService.listarPorProjeto(1)
    expect(tarefasProjeto1.length).toBe(2)
    expect(tarefasProjeto1.every((t) => t.projeto_id === 1)).toBe(true)
  })

  it('cria uma nova tarefa com sucesso', async () => {
    const nova = await taskService.criar(1, {
      titulo: 'Resolver simulado da prova',
      data_entrega: '2026-10-01',
      observacao: 'Focar em grafos e busca em profundidade',
    })

    expect(nova.id).toBeDefined()
    expect(nova.titulo).toBe('Resolver simulado da prova')
    expect(nova.status).toBe('pendente')
    expect(nova.projeto_id).toBe(1)

    const tarefas = await taskService.listarPorProjeto(1)
    expect(tarefas.some((t) => t.id === nova.id)).toBe(true)
  })

  it('valida que o título da tarefa é obrigatório', async () => {
    await expect(
      taskService.criar(1, {
        titulo: '   ',
      }),
    ).rejects.toThrow('O título da tarefa é obrigatório.')
  })

  it('alterna o status de pendente para concluido e vice-versa', async () => {
    const tarefas = await taskService.listarPorProjeto(1)
    const pendente = tarefas.find((t) => t.status === 'pendente')
    expect(pendente).toBeDefined()

    if (pendente) {
      const atualizada = await taskService.alternarStatus(pendente.id)
      expect(atualizada.status).toBe('concluido')

      const revertida = await taskService.alternarStatus(pendente.id)
      expect(revertida.status).toBe('pendente')
    }
  })

  it('atualiza os dados de uma tarefa existente', async () => {
    const tarefas = await taskService.listarPorProjeto(1)
    const primeira = tarefas[0]

    const atualizada = await taskService.atualizar(primeira.id, {
      titulo: 'Título Atualizado',
      observacao: 'Nova observação',
    })

    expect(atualizada.titulo).toBe('Título Atualizado')
    expect(atualizada.observacao).toBe('Nova observação')
  })

  it('exclui uma tarefa com sucesso', async () => {
    const tarefasAntes = await taskService.listarPorProjeto(1)
    const idParaExcluir = tarefasAntes[0].id

    await taskService.excluir(idParaExcluir)

    const tarefasDepois = await taskService.listarPorProjeto(1)
    expect(tarefasDepois.some((t) => t.id === idParaExcluir)).toBe(false)
  })

  it('remove tarefas em lote de um projeto específico', async () => {
    await taskService.excluirPorProjeto(1)
    const tarefasProjeto1 = await taskService.listarPorProjeto(1)
    expect(tarefasProjeto1.length).toBe(0)

    // Tarefas do projeto 2 devem permanecer
    const tarefasProjeto2 = await taskService.listarPorProjeto(2)
    expect(tarefasProjeto2.length).toBeGreaterThan(0)
  })
})
