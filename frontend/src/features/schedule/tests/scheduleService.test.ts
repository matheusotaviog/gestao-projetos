import { beforeEach, describe, expect, it } from 'vitest'
import { scheduleService } from '../services/scheduleService'

describe('scheduleService', () => {
  beforeEach(() => {
    scheduleService.resetMock()
  })

  it('lista os compromissos iniciais', async () => {
    const lista = await scheduleService.listar()
    expect(lista.length).toBe(2)
    expect(lista[0].projeto_id).toBe(1)
  })

  it('cria um novo compromisso valido', async () => {
    const criado = await scheduleService.criar({
      projeto_id: 1,
      data_inicio: '2026-09-10',
      data_fim: '2026-09-10',
      horario_inicio: '18:00',
      horario_fim: '20:00',
      observacao: 'Estudo dirigido de grafos',
    })

    expect(criado.id).toBe(3)
    expect(criado.observacao).toBe('Estudo dirigido de grafos')

    const todos = await scheduleService.listar()
    expect(todos.some((c) => c.id === criado.id)).toBe(true)
  })

  it('rejeita compromisso sem projeto valido', async () => {
    await expect(
      scheduleService.criar({
        projeto_id: 0,
        data_inicio: '2026-09-10',
        data_fim: '2026-09-10',
        horario_inicio: '10:00',
        horario_fim: '11:00',
      }),
    ).rejects.toThrow('Selecione um projeto válido.')
  })

  it('rejeita data de fim anterior a data de inicio', async () => {
    await expect(
      scheduleService.criar({
        projeto_id: 1,
        data_inicio: '2026-09-12',
        data_fim: '2026-09-10',
        horario_inicio: '10:00',
        horario_fim: '11:00',
      }),
    ).rejects.toThrow('A data de fim não pode ser anterior à data de início.')
  })

  it('rejeita horario de fim igual ou anterior ao horario de inicio', async () => {
    await expect(
      scheduleService.criar({
        projeto_id: 1,
        data_inicio: '2026-09-10',
        data_fim: '2026-09-10',
        horario_inicio: '14:00',
        horario_fim: '14:00',
      }),
    ).rejects.toThrow('O horário de fim deve ser posterior ao horário de início.')
  })
})
