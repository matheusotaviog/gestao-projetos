import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { ThemeSelector } from '../../components/ui/ThemeSelector'

describe('ThemeSelector', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  it('renderiza o seletor com todas as opções de tema', () => {
    render(<ThemeSelector />)

    const select = screen.getByRole('combobox', {
      name: 'Selecionar tema visual',
    })
    expect(select).toBeInTheDocument()
    expect(
      screen.getByRole('option', { name: 'Padrão' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('option', { name: 'Papel' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('option', { name: 'Sálvia' }),
    ).toBeInTheDocument()
  })

  it('atualiza o tema no documento e no localStorage ao selecionar uma opção', async () => {
    const user = userEvent.setup()
    render(<ThemeSelector />)

    const select = screen.getByRole('combobox', {
      name: 'Selecionar tema visual',
    })

    await user.selectOptions(select, 'warm-paper')

    expect(document.documentElement.getAttribute('data-theme')).toBe(
      'warm-paper',
    )
    expect(localStorage.getItem('gestao_projetos_theme')).toBe('warm-paper')

    await user.selectOptions(select, 'sage-focus')

    expect(document.documentElement.getAttribute('data-theme')).toBe(
      'sage-focus',
    )
    expect(localStorage.getItem('gestao_projetos_theme')).toBe('sage-focus')
  })
})
